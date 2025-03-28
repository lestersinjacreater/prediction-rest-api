import { Hono } from "hono";
import { 
  getUser, 
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser,
  // getUserByClerkId 
} from "./user.controller";
import { zValidator } from "@hono/zod-validator";
import { registerUserSchema, userSchema } from "../validators";
import { adminOrUserRoleAuth, adminRoleAuth } from "../middleware/bearAuth";

export const userRouter = new Hono();

// Get all users - admin only
userRouter.get("/users", adminRoleAuth, getUsers);

// Get a single user by numeric ID - accessible by admin or the user themselves
userRouter.get("/users/:id", adminOrUserRoleAuth, getUser);

// // Get a single user by Clerk ID (for authenticated sessions) - accessible by admin or the user themselves
// userRouter.get("/users/clerk/:clerkId", adminOrUserRoleAuth, getUserByClerkId);

// Create a user (registration using Clerk authentication - requires clerkId)
userRouter.post(
  "/users",
  zValidator('json', registerUserSchema, (result, c) => {
    if (!result.success) {
      return c.json(result.error, 400);
    }
  }),
  createUser
);

// Update a user (using numeric ID, validated with userSchema) - accessible by admin or the user themselves
userRouter.put(
  "/users/:id",
  adminOrUserRoleAuth,
  zValidator('json', userSchema, (result, c) => {
    if (!result.success) {
      return c.json(result.error, 400);
    }
  }),
  updateUser
);

// Delete a user (using numeric ID) - admin or the user themselves
userRouter.delete("/users/:id", adminOrUserRoleAuth, deleteUser);
