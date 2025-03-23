import { Context } from "hono";
import { createUpdateService, getUpdatesService, editUpdateService ,deleteUpdateService } from "./update.service";

//create an update (admin only)
export const createUpdate = async (c: Context) => {
    const update = await c.req.json();
    const createdUpdate = await createUpdateService(update);
    return c.json(createdUpdate, 200);
}

//delete an update (admin only)
export const deleteUpdate = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);
    const deletedUpdate = await deleteUpdateService(id);
    return c.json(deletedUpdate, 200);
}

//get all updates
export const getUpdates = async (c: Context) => {
    const updates = await getUpdatesService();
    return c.json(updates, 200);
}   

//edit an update (admin only)
export const editUpdate = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);
    const update = await c.req.json();
    const updatedUpdate = await editUpdateService(id, update);
    return c.json(updatedUpdate, 200);
}

