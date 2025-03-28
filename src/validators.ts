import { z } from 'zod';

// ----------------------------
// Users Schemas
// ----------------------------

// Schema for registering a new user (Clerk-auth integrated)
export const registerUserSchema = z.object({
  userid: z.number(),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  location: z.string().min(1, "Location is required"),
});

// Schema for a user record (e.g., for updates or retrieving user data)
export const userSchema = z.object({
  userid: z.number(),
  username: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string(),
});

// ----------------------------
// Predictions Schemas
// ----------------------------

export const predictionSchema = z.object({
  // Associate the prediction with a user via their internal user ID
  userid: z.number(),
  cropType: z.string().min(1, "Crop type is required"),
  // Process the planting date input to a Date object
  plantingDate: z.preprocess(
    (arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    },
    z.date({ invalid_type_error: "Invalid date format for plantingDate" })
  ),
  yieldPrediction: z.string().min(1, "Yield prediction is required"),
  // Process the harvest date input to a Date object
  harvestDate: z.preprocess(
    (arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    },
    z.date({ invalid_type_error: "Invalid date format for harvestDate" })
  ),
  // Optional JSON field for additional API response details
  predictionData: z.any().optional(),
});

// ----------------------------
// Feedback Schemas
// ----------------------------

export const feedbackSchema = z.object({
  // Link feedback to a specific prediction record
  predictionid: z.number(),
  // Optionally store the user ID for easier querying
  userid: z.number().optional(),
  // A numerical rating (e.g., 1 to 5) to indicate prediction accuracy
  accuracyRating: z.number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  // Optional comment with a maximum length of 1000 characters
  comment: z.string().max(1000, "Comment is too long").optional(),
  // Optional field for the actual yield reported by the user
  actualYield: z.string().optional(),
});

// ----------------------------
// Authentication Schemas
// ----------------------------
// Auth schemas
export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const authRegisterUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  //position: z.string(),
  role: z.enum(["admin", "user", "superuser"]).default("user"),
});