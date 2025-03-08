import { db } from "@/database/db";
import { UserI } from "@/types/user";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const addNewUser = async (newUser: UserI): Promise<{ id: string }[]> => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    const user = await db
      .insert(users)
      .values({
        name: newUser.name,
        email: newUser.email,
        password: hashedPassword,
        image: newUser.image,
        role: newUser.role || "user",
      })
      .returning({ id: users.id });

    return user;
  } catch (error) {
    console.error("Error adding new user:", error);
    throw error; // Re-throw to handle in the calling function
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    return await db.query.users.findFirst({
      where: (user) => eq(user.email, email),
      columns: {
        id: true,
        email: true,
        password: true,
        name: true,
        image: true,
        role: true,
      },
    });
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw error;
  }
};

// Helper function to update a user's password
export const updateUserPassword = async (
  userId: string,
  newPassword: string
): Promise<boolean> => {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId))
      .execute();

    return true;
  } catch (error) {
    console.error("Error updating password:", error);
    return false;
  }
};
