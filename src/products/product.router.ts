import { Hono } from "hono";
import { getProducts,createProduct,deleteProduct, updateProduct } from "./product.controller";
import { zValidator } from "@hono/zod-validator";
import { productSchema } from "../validators";
import { adminRoleAuth } from "../middleware/bearAuth";


export const productRouter = new Hono();

//create product
productRouter.post("/products",
    zValidator('json', productSchema),
    createProduct
);

//update product
productRouter.put("/products/:id", updateProduct);
//get all products
productRouter.get("/products", getProducts);

//delete product
productRouter.delete("/products/:id", deleteProduct);


