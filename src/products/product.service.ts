import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIProduct, TSProduct, ProductsTable } from "../drizzle/schema";

// create product
export const createProductService = async (product: TIProduct): Promise<string> => {
    await db.insert(ProductsTable).values(product);
    return "Product created successfully";
};

//delete services
export const deleteProductService = async (id: number): Promise<string> => {
    await db.delete(ProductsTable).where(eq(ProductsTable.productid, id));
    return "Product deleted successfully";
};

// get all services
export const getProductsService = async (): Promise<TSProduct[]> => {
    const products = await db.select().from(ProductsTable);
    return products;
};
// Update product - needed for product updates
export const updateProductService = async (id: number, product: Partial<TIProduct>): Promise<string> => {
    await db.update(ProductsTable)
        .set(product)
        .where(eq(ProductsTable.productid, id));
    return "Product updated successfully";
};
// Get product by ID - needed for product details
export const getProductService = async (id: number): Promise<TSProduct | null> => {
    const product = await db.query.ProductsTable.findFirst({
        where: eq(ProductsTable.productid, id)
    });
    return product || null;
};