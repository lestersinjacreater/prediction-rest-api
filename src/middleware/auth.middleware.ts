import { Context, Next } from "hono";
import { UsersTable } from "../drizzle/schema";
import db from "../drizzle/db";
import { eq } from "drizzle-orm";
// Import Clerk SDK
//  (adjust based on your Clerk setup)
import { clerkClient } from "@clerk/clerk-sdk-node";

export const adminGuard = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    return c.json({ error: "No authorization header" }, 401);
  }

  // Expected format: "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) {
    return c.json({ error: "Token not provided" }, 401);
  }

  try {
    // Verify the token using Clerk's SDK.
    const verifiedToken = await clerkClient.verifyToken(token);
    if (!verifiedToken) {
      return c.json({ error: "Invalid token" }, 401);
    }

    // Extract Clerk user ID from the verified token.
    const clerkId = verifiedToken.sub;
    if (!clerkId) {
      return c.json({ error: "Clerk user ID not found" }, 401);
    }

    // // Fetch the user from your Users table using the Clerk ID.
    // const user = await db.query.UsersTable.findFirst({
    //   where: eq(UsersTable.clerkId, clerkId),
    //   columns: { role: true }
    // });

    // if (!user || user.role !== "admin") {
    //   return c.json({ error: "Unauthorized" }, 403);
    // }

    // All good - proceed to next middleware/handler.
    await next();
  } catch (error: any) {
    console.error("Admin guard error:", error);
    return c.json({ error: "Unauthorized" }, 403);
  }
};
