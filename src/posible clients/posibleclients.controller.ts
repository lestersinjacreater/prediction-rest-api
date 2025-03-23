import { Context } from "hono";
import { createClientService, getclientsService, deleteClientsService, getClientByIdService } from "./posibleclients.servise";
import { sendClientConfirmationEmail } from "../mailer";

// // Create a client
// export const createClient = async (c: Context) => {
//     try {
//         const clientData = await c.req.json();
//         const createdClient = await createClientService(clientData);
//         return c.json(createdClient, 200);
//     } catch (error) {
//         console.error("Error creating client:", error);
//         return c.json({ error: "Failed to create client" }, 500);
//     }
// }


// Create a client
export const createClient = async (c: Context) => {
    try {
        const clientData = await c.req.json();
        const createdClient = await createClientService(clientData);

        // Send confirmation email
        await sendClientConfirmationEmail(clientData.email, clientData.firstname, clientData.lastname);

        return c.json(createdClient, 200);
    } catch (error) {
        console.error("Error creating client:", error);
        return c.json({ error: "Failed to create client" }, 500);
    }
};

// Get all possible clients
export const getclients = async (c: Context) => {
    try {
        const clients = await getclientsService();
        return c.json(clients, 200);
    } catch (error) {
        console.error("Error getting clients:", error);
        return c.json({ error: "Failed to get clients" }, 500);
    }
}

// Delete a client (admin only)
export const deleteClient = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        const client = await getClientByIdService(id);
        if (client == undefined) return c.text("Client not found", 404);
        const res = await deleteClientsService(id);
        if (!res) return c.text("Client not deleted", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}