import { AuthTable, TIAuth, TSAuth, UsersTable, TestimonialsTable } from "../drizzle/schema";
import db from "../drizzle/db";
import { sql } from "drizzle-orm";
import { loginUserSchema } from "../validators";
import type { z } from "zod";
import bycrpt from "bcrypt";

type LoginInput = z.infer<typeof loginUserSchema>;


// Create auth user service
export const createAuthUserService = async (userData: any): Promise<string | null> => {
    try {
        // Check if email already exists
        const existingUser = await db.query.UsersTable.findFirst({
            where: (users, { eq }) => eq(users.email, userData.email)
        });

        if (existingUser) {
            throw new Error("Email already registered");
        }

        // Hash the password if provided
        const hashedPassword = userData.password ? await bycrpt.hash(userData.password, 10) : null;

        // Create user record with minimal data
        const userResult = await db.insert(UsersTable).values({
            position: userData.position,
            username: userData.username,
            email: userData.email,
            phone: userData.phone || '', // Optional phone number
        }).returning();

        if (!userResult.length) {
            throw new Error("Failed to create user");
        }

        // Create auth record if password is provided
        if (hashedPassword) {
            const authData: TIAuth = {
                userid: userResult[0].userid,
                password: hashedPassword,
                role: 'user', // Default role
            };
            await db.insert(AuthTable).values(authData);
        }

        // Insert testimonial if provided
        if (userData.testimonial) {
            await db.insert(TestimonialsTable).values({
                userId: userResult[0].userid,
                text: userData.testimonial,
            });
        }

        return "User created successfully";
    } catch (error: any) {
        if (error.message.includes("users_email_unique")) {
            throw new Error("Email already registered");
        }
        throw error;
    }
}

// //create auth user service
// export const createAuthUserService = async (userData: any): Promise<string | null> => {
//     try {
//         // Check if email already exists
//         const existingUser = await db.query.UsersTable.findFirst({
//             where: (users, { eq }) => eq(users.email, userData.email)
//         });

//         if (existingUser) {
//             throw new Error("Email already registered");
//         }

//         // Hash the password
//         const hashedPassword = await bycrpt.hash(userData.password, 10);

//         // Create user record with minimal data
//         const userResult = await db.insert(UsersTable).values({
//             position: userData.position,
//             username: userData.username,
//             email: userData.email,
//             phone: userData.phone || '', // Optional phone number
//         }).returning();

//         if (!userResult.length) {
//             throw new Error("Failed to create user");
//         }

//         // Create auth record
//         const authData: TIAuth = {
//             userid: userResult[0].userid,
//             password: hashedPassword,
//             role: 'user', // Default role
//         };

//         await db.insert(AuthTable).values(authData);
//         return "User created successfully";
//     } catch (error: any) {
//         if (error.message.includes("users_email_unique")) {
//             throw new Error("Email already registered");
//         }
//         throw error;



//user login service
export const userLoginService = async (loginData: LoginInput) => {
    const { email, password } = loginData;
    return await db.query.AuthTable.findFirst({
        columns: {
            authid: true,
            role: true,
            password: true
        },
        where: (auth, { eq }) => eq(auth.userid, 
            db.select({ userid: UsersTable.userid })
              .from(UsersTable)
              .where(eq(UsersTable.email, email))
        ),
        with: {
            user: {
                columns: {
                    email: true,
                    userid: true
                }
            }
        }
    });
};



//get email by user id service
export const getEmailByUserId = async (id: number): Promise<string | null> => {
    const result = await db.query.UsersTable.findFirst({
        columns: {
            email: true,
        },
        where: (usr, { eq }) => eq(usr.userid, id),
    });
    return result?.email || null;
} 

//