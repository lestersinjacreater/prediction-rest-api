import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIPrediction, TSPrediction, PredictionsTable } from "../drizzle/schema";

// Create a new prediction record
export const createPredictionService = async (inputData: TIPrediction): Promise<string> => {
  // Insert the prediction record into the database
  await db.insert(PredictionsTable).values(inputData);
  return "Prediction created successfully";
};

// Delete a prediction record by its ID
export const deletePredictionService = async (id: number): Promise<string> => {
  await db.delete(PredictionsTable).where(eq(PredictionsTable.predictionid, id));
  return "Prediction deleted successfully";
};

// Retrieve all prediction records
export const getPredictionsService = async (): Promise<TSPrediction[]> => {
  const predictions = await db.select().from(PredictionsTable);
  return predictions;
};

// Update an existing prediction record by its ID
export const updatePredictionService = async (id: number, prediction: Partial<TIPrediction>): Promise<string> => {
  await db.update(PredictionsTable)
    .set(prediction)
    .where(eq(PredictionsTable.predictionid, id));
  return "Prediction updated successfully";
};

// Get a single prediction record by its ID
export const getPredictionService = async (id: number): Promise<TSPrediction | null> => {
  const prediction = await db.query.PredictionsTable.findFirst({
    where: eq(PredictionsTable.predictionid, id),
  });
  return prediction || null;
};