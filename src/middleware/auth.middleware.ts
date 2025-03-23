import { Context, Next } from "hono";
import { AuthTable, UsersTable } from "../drizzle/schema";
import db from "../drizzle/db";
import { eq } from "drizzle-orm";

export const adminGuard = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    return c.json({ error: "No authorization header" }, 401);
  }

  // Get token from header
  const token = authHeader.split(" ")[1];
  
  // Verify admin role using the correct schema
  const auth = await db.query.AuthTable.findFirst({
    where: (auth, { eq }) => eq(auth.userid, 
      db.select({ userid: UsersTable.userid })
        .from(UsersTable)
        .where(eq(UsersTable.email, token))
    ),
    columns: {
      role: true
    }
  });

  if (!auth || auth.role !== "admin") {
    return c.json({ error: "Unauthorized" }, 403);
  }

  await next();
}; 