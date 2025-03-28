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

    // Convert plantingDate and harvestDate to Date objects
    const processedData = {
      ...inputData,
      plantingDate: new Date(inputData.plantingDate), // Ensure plantingDate is a Date object
      harvestDate: new Date(inputData.harvestDate),   // Ensure harvestDate is a Date object
    };

    // Call the service to create the prediction
    const result = await createPredictionService(processedData);
    return c.json({ message: result }, 201); // Return 201 for resource creation
  } catch (error: any) {
    console.error("Error creating prediction:", error);
    return c.json({ error: error.message || "Failed to create prediction" }, 500);
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
    console.error("Error deleting prediction:", error);
    return c.json({ error: error.message || "Failed to delete prediction" }, 500);
  }
};

// Get all prediction records
export const getPredictions = async (c: Context) => {
  try {
    const predictions = await getPredictionsService();
    return c.json(predictions, 200);
  } catch (error: any) {
    console.error("Error fetching predictions:", error);
    return c.json({ error: error.message || "Failed to get predictions" }, 500);
  }
};

// Update an existing prediction record by its ID
export const updatePrediction = async (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
    const updateData = await c.req.json();
    const result = await updatePredictionService(id, updateData);
    return c.json({ message: result }, 200);
  } catch (error: any) {
    console.error("Error updating prediction:", error);
    return c.json({ error: error.message || "Failed to update prediction" }, 500);
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
    console.error("Error fetching prediction:", error);
    return c.json({ error: error.message || "Failed to get prediction" }, 500);
  }
};