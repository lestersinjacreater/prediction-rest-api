import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIClient, TSClient, ClientsTable } from "../drizzle/schema";

// Create  posible client
export const createClientService = async (client: TIClient): Promise<string> => {
  await db.insert(ClientsTable).values(client);
  return "Client created successfully";
};

// Delete posible client (admin only)
export const deleteClientsService = async (id: number): Promise<string> => {
    await db.delete(ClientsTable).where(eq(ClientsTable.clientid, id));
    return "Testimonial deleted successfully";
  };
  
//get all posible clients
export const getclientsService = async (): Promise<TSClient[]> => {
    return await db.query.ClientsTable.findMany();
  };


//get posible client by id
export const getClientByIdService = async (id: number): Promise<TSClient | null> => {
    const client = await db.query.ClientsTable.findFirst({
      where: (client, { eq }) => eq(client.clientid, id),
    });
    return client || null;
  };

  
