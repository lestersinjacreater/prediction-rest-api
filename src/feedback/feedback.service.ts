import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIFeedback, TSFeedback, FeedbackTable } from "../drizzle/schema";

// Get all feedback entries (optionally limit the number of records)
export const getFeedbackService = async (limit?: number): Promise<TSFeedback[]> => {
  if (limit) {
    return await db.query.FeedbackTable.findMany({
      limit,
      orderBy: (feedback, { desc }) => [desc(feedback.createdAt)]
    });
  }
  return await db.query.FeedbackTable.findMany({
    orderBy: (feedback, { desc }) => [desc(feedback.createdAt)]
  });
};

// Create a new feedback entry (e.g., after a prediction)
export const createFeedbackService = async (feedback: TIFeedback): Promise<string> => {
  await db.insert(FeedbackTable).values(feedback);
  return "Feedback submitted successfully";
};

// Delete a feedback entry (admin-only or owner-only based on your authorization logic)
export const deleteFeedbackService = async (id: number): Promise<string> => {
  await db.delete(FeedbackTable).where(eq(FeedbackTable.feedbackid, id));
  return "Feedback deleted successfully";
};

// Edit an existing feedback entry (admin-only or owner-only based on your authorization logic)
export const editFeedbackService = async (id: number, feedback: Partial<TIFeedback>): Promise<string> => {
  await db.update(FeedbackTable)
    .set(feedback)
    .where(eq(FeedbackTable.feedbackid, id));
  return "Feedback edited successfully";
};
