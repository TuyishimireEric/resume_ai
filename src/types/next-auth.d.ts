import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      session_token?: string;
      role?: string;
      image?: string;
      email: string;
      name: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
    session_token?: string;
    role?: string;
  }

  interface JWT {
    id: string;
    session_token?: string;
  }
}
