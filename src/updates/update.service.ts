import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIUpdate, TSUpdate, UpdatesTable } from "../drizzle/schema";

// Get all updates
export const getUpdatesService = async (limit?: number): Promise<TSUpdate[]> => {
  if (limit) {
    return await db.query.UpdatesTable.findMany({
      limit,
      orderBy: (updates, { desc }) => [desc(updates.createdAt)]
    });
  }
  return await db.query.UpdatesTable.findMany({
    orderBy: (updates, { desc }) => [desc(updates.createdAt)]
  });
};

// Create update (admin only)
export const createUpdateService = async (update: TIUpdate): Promise<string> => {
  await db.insert(UpdatesTable).values(update);
  return "Update created successfully";
};

// Delete update (admin only)
export const deleteUpdateService = async (id: number): Promise<string> => {
  await db.delete(UpdatesTable).where(eq(UpdatesTable.updateid, id));
  return "Update deleted successfully";
};

// Edit update (admin only)
export const editUpdateService = async (id: number, update: Partial<TIUpdate>): Promise<string> => {
  await db.update(UpdatesTable)
    .set(update)
    .where(eq(UpdatesTable.updateid, id));
  return "Update edited successfully";
}; 