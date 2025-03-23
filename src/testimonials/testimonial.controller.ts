import { Context } from "hono";
import { createTestimonialService, getTestimonialByIdService,getTestimonialsService ,deleteTestimonialService, updateTestimonialService } from "./testimonial.service";
import { getEmailByUserId } from "../auth/auth.service";
import { sendTestimonialThanksEmail } from "../mailer";
import { getUserService } from "../users/user.service";

// //create a testimonial
// export const createTestimonial = async (c: Context) => {
//     try {
//         const testimonial = await c.req.json();
//         const createdTestimonial = await createTestimonialService(testimonial);
        
//         // Get user details including username
//         const user = await getUserService(testimonial.userId);
//         if (user && user.email) {
//             try {
//                 await sendTestimonialThanksEmail(user.email, user.username);
//             } catch (error) {
//                 console.error("Error sending testimonial thank you email:", error);
//             }
//         }

//         return c.json(createdTestimonial, 200);
//     } catch (error) {
//         console.error("Error creating testimonial:", error);
//         return c.json({ error: "Failed to create testimonial" }, 500);
//     }
// }



// Create a testimonial
export const createTestimonial = async (c: Context) => {
    try {
        const testimonial = await c.req.json();
        const createdTestimonial = await createTestimonialService(testimonial);
        
        // Get user details including username
        const user = await getUserService(testimonial.userId);
        if (user && user.email) {
            try {
                await sendTestimonialThanksEmail(user.email, user.username);
            } catch (error) {
                console.error("Error sending testimonial thank you email:", error);
            }
        }

        return c.json(createdTestimonial, 200);
    } catch (error) {
        console.error("Error creating testimonial:", error);
        return c.json({ error: "Failed to create testimonial" }, 500);
    }
};

//delete a testimonial (admin only)
export const deleteTestimonial = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);
    const deletedTestimonial = await deleteTestimonialService(id);
    return c.json(deletedTestimonial, 200);
}
 //get all testimonials
export const getTestimonials = async (c: Context) => {
    const testimonials = await getTestimonialsService();
    return c.json(testimonials, 200);
}   

//get testimonial by id
export const getTestimonialById = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);
    const testimonial = await getTestimonialByIdService(id);
    return c.json(testimonial, 200);
}


//update a testimonial
export const updateTestimonial = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const testimonial = await c.req.json();
    try {
        // search for the testimonial
        const searchedTestimonial = await getTestimonialByIdService(id);
        if (searchedTestimonial == undefined) return c.text("Testimonial not found", 404);
        // get the data and update it
        const res = await updateTestimonialService(id, testimonial);
        // return a success message
        if (!res) return c.text("Testimonial not updated", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
};