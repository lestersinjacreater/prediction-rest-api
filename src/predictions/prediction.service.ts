import { eq } from "drizzle-orm";
import axios from "axios";
import db from "../drizzle/db";
import { TIPrediction, TSPrediction, PredictionsTable } from "../drizzle/schema";

// Replace this URL with your external prediction API endpoint
const EXTERNAL_API_URL = "https://external-prediction-api.example.com/predict";

// Function to call external API and fetch prediction
const fetchPredictionFromExternalAPI = async (inputData: Omit<TIPrediction, "yieldPrediction" | "harvestDate" | "predictionData">) => {
  // Make the API call with the input data
  const response = await axios.post(EXTERNAL_API_URL, inputData);
  // Extract the prediction details from the API response.
  // This structure will depend on the external API's response format.
  const { predictedYield, estimatedHarvestDate, ...extraData } = response.data;
  return {
    yieldPrediction: predictedYield,
    harvestDate: new Date(estimatedHarvestDate),
    predictionData: extraData,
  };
};

// Create a new prediction record by calling the external API first
export const createPredictionService = async (inputData: Omit<TIPrediction, "yieldPrediction" | "harvestDate" | "predictionData">): Promise<string> => {
  // Fetch prediction from external API
  const predictionResult = await fetchPredictionFromExternalAPI(inputData);

  // Build the full prediction object for storage
  const predictionToStore: TIPrediction = {
    ...inputData,
    yieldPrediction: predictionResult.yieldPrediction,
    harvestDate: predictionResult.harvestDate,
    predictionData: predictionResult.predictionData,
  };

  // Insert the prediction record into the database
  await db.insert(PredictionsTable).values(predictionToStore);
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
