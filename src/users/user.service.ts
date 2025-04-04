import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIUser, TSUser, UsersTable } from "../drizzle/schema";

// // Get user by Clerk ID - used for authentication and profile
// export const getUserByClerkIdService = async (clerkId: string): Promise<TSUser | null> => {
//   const user = await db.query.UsersTable.findFirst({
//     where: eq(UsersTable.clerkId, clerkId)
//   });
//   return user || null;
// };

// Optionally, you can keep the getUserService by local user id if needed
export const getUserService = async (id: number): Promise<TSUser | null> => {
  const user = await db.query.UsersTable.findFirst({
    where: eq(UsersTable.userid, id)
  });
  return user || null;
};

// Create user - during registration (using Clerk's user details)
// Ensure the clerkId is passed as part of the user object
export const createUserService = async (user: TIUser): Promise<string> => {
  await db.insert(UsersTable).values(user);
  return "User created successfully";
};

// Update user - for profile updates
export const updateUserService = async (id: number, user: Partial<TIUser>): Promise<string> => {
  await db.update(UsersTable)
    .set(user)
    .where(eq(UsersTable.userid, id));
  return "User updated successfully";
};

// Delete user - for account deletion
export const deleteUserService = async (id: number): Promise<string> => {
  await db.delete(UsersTable).where(eq(UsersTable.userid, id));
  return "User deleted successfully";
};

// Get all users (if needed for admin functionality)
export const getUsersService = async (): Promise<TSUser[]> => {
  return await db.query.UsersTable.findMany();
};
