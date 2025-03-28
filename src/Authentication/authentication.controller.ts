import "dotenv/config";
import { Context } from "hono";
import { createAuthUserService, getEmailByUserId, userLoginService } from "./authentication.service";
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
        // Extract the JSON payload from the request, which contains the login data (email and password)
        const loginData = await c.req.json();

        // Use the userLoginService to login the user and retrieve their authentication records
        const userAuth: { user?: { email: string; userid: string }; password?: string } = await userLoginService(loginData);

        // Log the authentication record
        console.log("Authentication record:", userAuth);

        // If the user authentication record is not found, return an error message
        if (!userAuth) {
            console.log("No user was found with this email:", loginData.email);
            return c.json({ error: "User not found" }, 404);
        }

        // If the auth record does not contain a password, log the issue and return a 400 response
        if (!userAuth.password) {
            console.log("No password found for user");
            return c.json({ error: "Invalid user data" }, 400);
        }

        try {
            // Compare the provided password with the stored hashed password using bcrypt
            const passwordMatch = await bcrypt.compare(loginData.password, userAuth.password);
            console.log("Password comparison result:", passwordMatch);

            // If the passwords do not match, return a 401 Unauthorized response
            if (!passwordMatch) {
                return c.json({ error: "Invalid credentials" }, 401);
            }
        } catch (error) {
            // If an error occurs during password comparison, log it and return a 500 Internal Server Error response
            console.error("Password comparison error:", error);
            return c.json({ error: "Error verifying credentials" }, 500);
        }

        // Create the payload for the JWT (JSON Web Token)
        const payload = {
            sub: userAuth.user?.email, // Access email from the user object
            userid: userAuth.user?.userid, // Access userid from the user object
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 3), // Token expires in 3 hours
        };

        // Sign the JWT token
        const token = await sign(payload, process.env.JWT_SECRET as string);

        return c.json({
            token,
            user: {
                email: userAuth.user?.email, // Access email from the user object
                userid: userAuth.user?.userid, // Access userid from the user object
            },
        }, 200);
    } catch (error: any) {
        console.error("Login error:", error);
        return c.json({
            error: error.message || "Login failed",
            details: process.env.NODE_ENV === "development" ? error.stack : undefined,
        }, 400);
    }
};