import { Hono } from "hono";
import { 
  createFeedback, 
  deleteFeedback, 
  getFeedback, 
  editFeedback 
} from "./feedback.controller";
import { zValidator } from "@hono/zod-validator";
import { feedbackSchema } from "../validators";
//import { adminRoleAuth, userRoleAuth } from "../middleware/bearAuth";

export const feedbackRouter = new Hono();

// Create a feedback entry - accessible by authenticated users
feedbackRouter.post(
  "/feedback",
  // userRoleAuth,
  zValidator('json', feedbackSchema, (result, c) => {
    if (!result.success) {
      return c.json(result.error, 400);
    }
  }),
  createFeedback
);

// Delete a feedback entry - admin only
feedbackRouter.delete("/feedback/:id", 
  // adminRoleAuth,
   deleteFeedback);

// Get all feedback entries - admin only
feedbackRouter.get("/feedback", 
  // adminRoleAuth,
   getFeedback);

// Edit a feedback entry - admin only
feedbackRouter.put(
  "/feedback/:id",
  // adminRoleAuth,
  zValidator('json', feedbackSchema, (result, c) => {
    if (!result.success) {
      return c.json(result.error, 400);
    }
  }),
  editFeedback
);
