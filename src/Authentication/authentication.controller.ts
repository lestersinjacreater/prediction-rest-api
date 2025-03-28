import "dotenv/config";
import { Context } from "hono";
import { createAuthUserService, userLoginService } from "./authentication.service";
import bcrypt from "bcrypt";
import { sign } from "hono/jwt";
// import { sendWelcomeEmail } from "../mailer";

// Register user controller
export const registerUser = async (c: Context) => {
  try {
    const userData = await c.req.json();

    // Log the received data
    console.log("Received registration data:", userData);

    const createdUser = await createAuthUserService(userData);
    if (!createdUser) {
      return c.json({ error: "User not registered" }, 404);
    }

    // Commented out email-sending functionality
    /*
    try {
      await sendWelcomeEmail(userData.email, userData.username);
    } catch (error) {
      console.error("Error sending welcome email:", error);
      return c.json({
        message: "User registered successfully but failed to send welcome email",
        success: true,
      }, 201);
    }
    */

    return c.json({
      message: "User registered successfully",
      success: true,
    }, 201);

  } catch (error: any) {
    console.error("Error during registration:", error);
    return c.json({
      error: error.message || "Registration failed",
      success: false,
    }, 400);
  }
};

// Login user controller
export const loginUser = async (c: Context) => {
  try {
    const loginData = await c.req.json();

    // Use the userLoginService to login the user and retrieve their authentication record
    const userAuth: { user?: { email: string; userid: string | number } | null; password?: string } = await userLoginService(loginData);

    // Check if the user authentication record exists and is valid
    if (!userAuth || !userAuth.user) {
      console.log("No user was found with this email:", loginData.email);
      return c.json({ error: "User not found" }, 404);
    }

    if (!userAuth.password) {
      console.log("No password found for user");
      return c.json({ error: "Invalid user data" }, 400);
    }

    // Ensure userid is a string and handle potential null values
    const user = {
      email: userAuth.user.email,
      userid: userAuth.user.userid.toString()
    };

    const passwordMatch = await bcrypt.compare(loginData.password, userAuth.password);
    if (!passwordMatch) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const payload = {
      sub: user.email,
      userid: user.userid,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 3), // Token expires in 3 hours
    };

    const token = await sign(payload, process.env.JWT_SECRET as string);

    return c.json({
      token,
      user,
    }, 200);
  } catch (error: any) {
    console.error("Login error:", error);
    return c.json({
      error: error.message || "Login failed",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    }, 400);
  }
};
