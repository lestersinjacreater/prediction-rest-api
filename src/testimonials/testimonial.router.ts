import { Hono } from "hono";
import { createTestimonial, deleteTestimonial, getTestimonialById, getTestimonials, updateTestimonial } from "./testimonial.controller";
import { zValidator } from "@hono/zod-validator";
import { testimonialSchema } from "../validators";
import { adminOrUserRoleAuth, adminRoleAuth, superuserRoleAuth, userRoleAuth } from "../middleware/bearAuth";

export const testimonialRouter = new Hono();

//get all testimonials
testimonialRouter.get("/testimonials", getTestimonials);

//get testimonial by id
testimonialRouter.get("/testimonials/:id",  getTestimonialById);

testimonialRouter.put("/testimonials/:id",  updateTestimonial);

//create a testimonial
testimonialRouter.post("/testimonials", 
    zValidator('json', testimonialSchema),
    createTestimonial
);
//delete a testimonial (admin only)
testimonialRouter.delete("/testimonials/:id", 
    // adminRoleAuth,  // Only users with admin role can pass this middleware
    deleteTestimonial
);





