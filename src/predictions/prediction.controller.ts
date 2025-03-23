import { Context } from "hono";
import { 
  createPredictionService, 
  deletePredictionService, 
  getPredictionService, 
  getPredictionsService, 
  updatePredictionService 
} from "./prediction.service";

// Create a prediction record
export const createPrediction = async (c: Context) => {
  try {
    // Expect input data from the frontend (e.g., crop type, planting date, etc.)
    const inputData = await c.req.json();
    // This service will call the external API, merge the result with the input data, and store the prediction.
    const result = await createPredictionService(inputData);
    return c.json({ message: result }, 200);
  } catch (error: any) {
    console.error("Error creating prediction", error);
    return c.json({ error: "Failed to create prediction" }, 500);
  }
};

// Delete a prediction record by its ID
export const deletePrediction = async (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
    const result = await deletePredictionService(id);
    return c.json({ message: result }, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
};

// Get all prediction records
export const getPredictions = async (c: Context) => {
  try {
    const predictions = await getPredictionsService();
    return c.json(predictions, 200);
  } catch (error: any) {
    console.error("Error fetching predictions", error);
    return c.json({ error: "Failed to get predictions" }, 500);
  }
};

// Update an existing prediction record by its ID
export const updatePrediction = async (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
    // Optionally, you might want to check if the prediction exists before updating
    const updateData = await c.req.json();
    const result = await updatePredictionService(id, updateData);
    return c.json({ message: result }, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
};

// Get a single prediction record by its ID
export const getPrediction = async (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
    const prediction = await getPredictionService(id);
    if (!prediction) return c.text("Prediction not found", 404);
    return c.json(prediction, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
};
