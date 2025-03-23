import { Hono } from "hono";
import { 
  createPrediction, 
  deletePrediction, 
  getPredictions, 
  updatePrediction,
  getPrediction 
} from "./prediction.controller";
import { zValidator } from "@hono/zod-validator";
import { predictionSchema } from "../validators";
import { adminRoleAuth, adminOrUserRoleAuth, userRoleAuth } from "../middleware/bearAuth";

export const predictionRouter = new Hono();

// Create a prediction - accessible by authenticated users
predictionRouter.post(
  "/predictions",
  userRoleAuth,
  zValidator("json", predictionSchema, (result, c) => {
    if (!result.success) {
      return c.json(result.error, 400);
    }
  }),
  createPrediction
);

// Update a prediction - accessible by admin or the owner of the prediction
predictionRouter.put(
  "/predictions/:id",
  adminOrUserRoleAuth,
  zValidator("json", predictionSchema, (result, c) => {
    if (!result.success) {
      return c.json(result.error, 400);
    }
  }),
  updatePrediction
);

// Get all predictions - admin only
predictionRouter.get("/predictions", adminRoleAuth, getPredictions);

// Get a single prediction - accessible by admin or the owner of the prediction
predictionRouter.get("/predictions/:id", adminOrUserRoleAuth, getPrediction);

// Delete a prediction - admin only
predictionRouter.delete("/predictions/:id", adminRoleAuth, deletePrediction);
