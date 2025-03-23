import { Context } from "hono";
import { createServiceService,deleteServiceService,getServiceByIdService,getServicesService, updateServiceService } from "./services.service";

// Create a  service
export const createService = async (c: Context) => {
    try {
        const serviceData = await c.req.json();
        const createdservice = await createServiceService(serviceData);
        return c.json(createdservice, 200);
    } catch (error) {
        console.error("Error creating service:", error);
        return c.json({ error: "Failed to create service" }, 500);
    }
}

//delete a service
export const deleteService = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        const service = await deleteServiceService(id);
        if (service == undefined) return c.text("service not found", 404);
        const res = await deleteServiceService(id);
        if (!res) return c.text("service not deleted", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}


//get all services
export const getServices = async (c: Context) => {
    try {
        const services = await getServicesService();
        return c.json(services, 200);
    } catch (error) {
        console.error("Error getting services:", error);
        return c.json({ error: "Failed to get services" }, 500);
    }
}


   
// update a service
export const updateService = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const serviceData = await c.req.json();
    try {
        // search for the service
        const searchedService = await getServiceByIdService(id);
        if (searchedService == undefined) return c.text("Service not found", 404);
        // get the data and update it
        const res = await updateServiceService(id, serviceData);
        // return a success message
        if (!res) return c.text("Service not updated", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}