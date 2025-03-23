import "dotenv/config";
import { Context } from "hono";
import { createAuthUserService, getEmailByUserId, userLoginService } from "./auth.service";
import bycrpt from "bcrypt";
import { sign } from "hono/jwt";
import { sendWelcomeEmail } from "../mailer";

//register user controller
export const registerUser = async (c: Context) => {
    try {
        const userData = await c.req.json();
        
        // Log the received data
        console.log('Received registration data:', userData);
        
        const createdUser = await createAuthUserService(userData);
        if (!createdUser) {
            return c.json({ error: "User not registered" }, 404);
        }

        try {
            await sendWelcomeEmail(userData.email, userData.username);
        } catch (error) {
            console.error("Error sending welcome email:", error);
            return c.json({ 
                message: "User registered successfully but failed to send welcome email",
                success: true 
            }, 201);
        }

        return c.json({ 
            message: "User registered successfully",
            success: true 
        }, 201);

    } catch (error: any) {
        console.error("Error during registration:", error);
        return c.json({ 
            error: error.message || "Registration failed",
            success: false 
        }, 400);
    }
};

//login user controller
export const loginUser = async (c: Context) => {
    try {
        const loginData = await c.req.json();
        
        // Find user and auth record
        const userAuth = await userLoginService(loginData);
        
        // Debug log to check what we're getting back
        console.log('Auth record:', userAuth);
        
        if (!userAuth) {
            console.log('No user found with email:', loginData.email);
            return c.json({ error: "User not found" }, 404);
        }

        if (!userAuth.password) {
            console.log('No password found for user');
            return c.json({ error: "Invalid user data" }, 400);
        }

        try {
            // Compare provided password with stored hash
            const passwordMatch = await bycrpt.compare(loginData.password, userAuth.password);
            console.log('Password comparison result:', passwordMatch);

            if (!passwordMatch) {
                return c.json({ error: "Invalid credentials" }, 401);
            }
        } catch (error) {
            console.error('Password comparison error:', error);
            return c.json({ error: "Error verifying credentials" }, 500);
        }

        // Create JWT payload
        const payload = {
            sub: userAuth.user?.email,
            role: userAuth.role,
            exp: Math.floor(Date.now() / 1000) + (60 * 1800)
        }
        
        const token = await sign(payload, process.env.JWT_SECRET as string);
        
        return c.json({ 
            token, 
            user: { 
                email: userAuth.user?.email,
                role: userAuth.role,
                userid: userAuth.user?.userid
            } 
        }, 200);
    } catch (error: any) {
        console.error('Login error:', error);
        return c.json({ 
            error: error.message || "Login failed",
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, 400);
    }
}




