import { Context } from "hono";
import {
  getUserByClerkIdService,
  getUserService,
  getUsersService,
  createUserService,
  updateUserService,
  deleteUserService,
} from "./user.service";

// Get all users (admin route, for example)
export const getUsers = async (c: Context) => {
  const users = await getUsersService();
  return c.json(users);
};

// Get user by Clerk ID (recommended for auth)
// Assume Clerk's user ID is available via a route parameter (or you can extract it from Clerk's session context)
export const getUserByClerkId = async (c: Context) => {
  const clerkId = c.req.param("clerkId");
  if (!clerkId) return c.text("Invalid Clerk ID", 400);

  const user = await getUserByClerkIdService(clerkId);
  if (!user) {
    return c.text("User not found", 404);
  }
  return c.json(user, 200);
};

// Alternatively, if needed, get user by numeric id (less used with Clerk)
export const getUser = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  const user = await getUserService(id);
  if (!user) return c.text("User not found", 404);
  return c.json(user, 200);
};

// Create a user
// Make sure the incoming JSON includes the Clerk ID field (e.g., clerkId)
export const createUser = async (c: Context) => {
  try {
    const user = await c.req.json();
    // Check if clerkId is provided
    if (!user.clerkId) {
      return c.text("Missing Clerk ID", 400);
    }
    const createdUser = await createUserService(user);
    if (!createdUser) return c.text("User not created", 404);
    return c.json({ msg: createdUser }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
};

// Update a user (using numeric ID for update, though you could also update by clerkId if preferred)
export const updateUser = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  try {
    // Ensure the user exists before updating
    const searchedUser = await getUserService(id);
    if (!searchedUser) return c.text("User not found", 404);

    const userUpdates = await c.req.json();
    const res = await updateUserService(id, userUpdates);
    if (!res) return c.text("User not updated", 404);

    return c.json({ msg: res }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
};

// Delete a user (using numeric ID)
export const deleteUser = async (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  try {
    // Confirm user exists before deletion
    const user = await getUserService(id);
    if (!user) return c.text("User not found", 404);

    const res = await deleteUserService(id);
    if (!res) return c.text("User not deleted", 404);

    return c.json({ msg: res }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
};
