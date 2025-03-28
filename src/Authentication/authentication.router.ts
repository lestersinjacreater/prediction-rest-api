import { Hono } from "hono";
import { registerUser, loginUser } from "./authentication.controller";
import { zValidator } from "@hono/zod-validator";
import { loginUserSchema, authRegisterUserSchema } from "../validators";

export const authRouter = new Hono();

// Register a new user
authRouter.post(
  "/auth/register",
  zValidator("json", authRegisterUserSchema, (result, c) => {
    if (!result.success) {
      return c.json(result.error, 400);
    }
  }),
  registerUser
);

// Login a user
authRouter.post(
  "/auth/login",
  zValidator("json", loginUserSchema, (result, c) => {
    if (!result.success) {
      return c.json(result.error, 400);
    }
  }),
  loginUser
);