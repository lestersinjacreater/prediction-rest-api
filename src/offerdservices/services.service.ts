import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIService, TSService, ServicesTable } from "../drizzle/schema";


// Create  service
export const createServiceService = async (service: TIService): Promise<string> => {
  await db.insert(ServicesTable).values(service);
  return "Service created successfully";
};

// delete service
export const deleteServiceService = async (id: number): Promise<string> => {
    await db.delete(ServicesTable).where(eq(ServicesTable.serviceid, id));
    return "Service deleted successfully";
  };

// get all services
export const getServicesService = async (): Promise<TSService[]> => {
    return await db.query.ServicesTable.findMany();
  };
  
  
  // Get service by ID
  export const getServiceByIdService = async (id: number): Promise<TSService | null> => {
    const service = await db.query.ServicesTable.findFirst({
      where: eq(ServicesTable.serviceid, id)
    });
    return service || null;
  };
  // Update service - needed for service updates
  export const updateServiceService = async (id: number, service: Partial<TIService>): Promise<string> => {
    await db.update(ServicesTable)
      .set(service)
      .where(eq(ServicesTable.serviceid, id));
    return "Service updated successfully";
  };