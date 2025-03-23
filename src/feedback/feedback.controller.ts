import { Context } from "hono";
import { 
  createFeedbackService, 
  getFeedbackService, 
  editFeedbackService, 
  deleteFeedbackService 
} from "./feedback.service";

// Create a new feedback entry (e.g., after a prediction)
export const createFeedback = async (c: Context) => {
  try {
    const feedback = await c.req.json();
    const result = await createFeedbackService(feedback);
    return c.json({ message: result }, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
};

// Delete a feedback entry (admin-only or owner-only)
export const deleteFeedback = async (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
    const result = await deleteFeedbackService(id);
    return c.json({ message: result }, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
};

// Get all feedback entries (optionally with a limit query parameter)
export const getFeedback = async (c: Context) => {
  try {
    const limitParam = c.req.query("limit");
    const limit = limitParam ? Number(limitParam) : undefined;
    const feedbacks = await getFeedbackService(limit);
    return c.json(feedbacks, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
};

// Edit an existing feedback entry
export const editFeedback = async (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
    const feedback = await c.req.json();
    const result = await editFeedbackService(id, feedback);
    return c.json({ message: result }, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
};
