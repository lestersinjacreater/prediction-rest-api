import { AuthTable, TIAuth, UsersTable } from "../drizzle/schema";
import db from "../drizzle/db";
import { sql } from "drizzle-orm";
import { loginUserSchema } from "../validators";
import type { z } from "zod";
import bcrypt from "bcrypt";

type LoginInput = z.infer<typeof loginUserSchema>;

/**
 * Creates a new authentication user.
 * 
 * Checks if the email already exists in the Users table.
 * If not, it creates a user record, hashes the password (if provided),
 * and inserts an auth record with a default role.
 * 
 * @param userData - The data for the new user.
 * @returns A success message or throws an error if the email is already registered.
 */
export const createAuthUserService = async (userData: any): Promise<string | null> => {
  try {
    // Check if the email is already registered.
    const existingUser = await db.query.UsersTable.findFirst({
      where: (users, { eq }) => eq(users.email, userData.email),
    });

    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Hash the password if provided.
    const hashedPassword = userData.password ? await bcrypt.hash(userData.password, 10) : null;

    // Create a new user record with required data.
    const userResult = await db.insert(UsersTable).values({
      //clerkId: userData.clerkId, // Clerk's unique user ID
      username: userData.username,
      email: userData.email,
      phone: userData.phone || "", // Optional phone number.
      location: userData.location || "", // Optional location.
    }).returning();

    if (!userResult.length) {
      throw new Error("Failed to create user");
    }

    // If a password was provided, create an auth record.
    if (hashedPassword) {
      const authData: TIAuth = {
        userid: userResult[0].userid,
        password: hashedPassword,
      };
      await db.insert(AuthTable).values(authData);
    }

    return "User created successfully";
  } catch (error: any) {
    if (error.message.includes("users_email_unique")) {
      throw new Error("Email already registered");
    }
    throw error;
  }
};

/**
 * Logs in a user by retrieving their authentication record.
 * 
 * It queries the AuthTable based on the email from the Users table
 * and retrieves the associated auth record (including hashed password).
 * 
 * @param loginData - The login credentials.
 * @returns The authentication record if found.
 */
export const userLoginService = async (loginData: LoginInput) => {
  const { email, password } = loginData;

  // Retrieve the user and auth record based on the email.
  const authRecord = await db.query.AuthTable.findFirst({
    columns: {
      authid: true,
      password: true,
    },
    where: (auth, { eq }) =>
      eq(
        auth.userid,
        db.select({ userid: UsersTable.userid })
          .from(UsersTable)
          .where(eq(UsersTable.email, email))
      ),
    with: {
      user: {
        columns: {
          email: true,
          userid: true,
        },
      },
    },
  });

  if (!authRecord) {
    throw new Error("Invalid email or password");
  }

  // Verify the password.
  const isPasswordValid = await bcrypt.compare(password, authRecord.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  return authRecord;
};
/**
 * Retrieves the email address associated with a given user ID.
 * 
 * @param id - The user ID.
 * @returns The user's email address or null if not found.
 */
export const getEmailByUserId = async (id: number): Promise<string | null> => {
  const result = await db.query.UsersTable.findFirst({
    columns: {
      email: true,
    },
    where: (usr, { eq }) => eq(usr.userid, id),
  });
  return result?.email || null;
};