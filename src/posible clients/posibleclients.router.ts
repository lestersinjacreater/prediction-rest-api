import { Hono } from "hono";
import { createClient, getclients, deleteClient } from "./posibleclients.controller";
import { zValidator } from "@hono/zod-validator";
import { clientSchema } from "../validators";
import { adminRoleAuth } from "../middleware/bearAuth";

export const clientRouter = new Hono();

// Get all possible clients (admin only)
clientRouter.get("/clients", adminRoleAuth, getclients);

// Create new possible client
clientRouter.post("/clients", 
    zValidator('json', clientSchema),
    createClient
);

// Delete possible client
clientRouter.delete("/clients/:id", adminRoleAuth, deleteClient);