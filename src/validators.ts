import { z } from 'zod';

// Auth schemas
export const loginUserSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export const registerUserSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    //password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().optional(),
    position: z.string(),
    role: z.enum(["admin", "user", "superuser"]).default("user"),
});

// User schema
export const userSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
});

// Testimonial schema
export const testimonialSchema = z.object({
    userId: z.number(),
    text: z.string().min(1).max(1000),
});

// Update schema
export const updateSchema = z.object({
    userId: z.number(),
    content: z.string().min(1).max(500),
});

// Possible clients schema
export const clientSchema = z.object({
    firstname: z.string().min(3),
    lastname: z.string().min(3),
    email: z.string().email(),
    phone: z.string().optional(),
    subject: z.string().min(3),
    message: z.string().min(1).max(1000),
});

//services schema
export const serviceSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(3).max(1000),
});

//products schema
export const productSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(3).max(1000),
});