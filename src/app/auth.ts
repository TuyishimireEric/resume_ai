import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/database/db";
import { randomBytes } from "crypto";
import { addNewUser, getUserByEmail } from "@/database/queries";
import { session } from "@/database/schema";
import bcrypt from "bcryptjs";

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.password || !credentials?.email) {
          return null;
        }
        
        try {
          // Get user by email
          const user = await getUserByEmail(credentials.email);
          
          // If user doesn't exist, return null
          if (!user) {
            console.log("User not found with email:", credentials.email);
            return null;
          }
          
          // Ensure password exists before verification
          if (!user.password) {
            console.log("User has no password set");
            return null;
          }
          
          // Verify password with proper error handling
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password ?? ""
          );
            

          console.log("Credentials", credentials);
          console.log("User", user);
          console.log("Password match result:", passwordMatch);
          
          // If passwords don't match, return null
          if (!passwordMatch) {
            return null;
          }
          
          // Return user data
          return {
            id: user.id,
            email: user.email || "",
            name: user.name || undefined,
            image: user.image || undefined,
            role: user.role || "user",
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await getUserByEmail(user.email as string);

          if (!existingUser) {
            // Generate a secure random password for OAuth users
            const secureRandomPassword = randomBytes(32).toString("hex");
            
            // Make sure to await the user creation to complete
            const newUser = await addNewUser({
              name: user.name as string,
              email: user.email as string,
              password: secureRandomPassword, // Will be hashed in addNewUser
              image: user.image as string,
              role: "user",
            });
            
            if (newUser && newUser.length > 0) {
              user.id = newUser[0].id;
              user.role = "user";
            } else {
              throw new Error("Failed to create new user");
            }
          } else {
            user.id = existingUser.id;
            user.role = existingUser.role as string;
          }
        } catch (err) {
          console.error("Sign in error:", err);
          return false; // Return false instead of error message
        }
      }

      // Create session after user is fully processed
      try {
        const Expires = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
        const sessionToken = uuidv4();
        
        await db.insert(session).values({
          session_token: sessionToken,
          user_id: user.id as string,
          expires: Expires,
        });

        user.session_token = sessionToken;
        return true;
      } catch (err) {
        console.error("Session creation error:", err);
        return false; // Return false instead of error message
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.session_token = user.session_token;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.session_token = token.session_token as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/`;
      }
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day in seconds
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      console.error("NextAuth Error:", code, metadata);
    },
    warn(code) {
      console.warn("NextAuth Warning:", code);
    },
    debug(code, metadata) {
      console.debug("NextAuth Debug:", code, metadata);
    },
  },
};