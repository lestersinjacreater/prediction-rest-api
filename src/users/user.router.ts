import { Hono } from "hono";
import {  getUser,getUsers, createUser, updateUser, deleteUser} from "./user.controller"
import { zValidator } from "@hono/zod-validator";
import { userSchema } from "../validators";
import { adminOrUserRoleAuth, adminRoleAuth} from "../middleware/bearAuth";
// import { adminRoleAuth } from "../middleware/bearAuth";
export const userRouter = new Hono();

//get all users
userRouter.get("/users",getUsers );

//get a single user   
userRouter.get("/users/:id" , getUser)
// create a user 
userRouter.post("/users", zValidator('json', userSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}) ,createUser)
//update a user
userRouter.put("/users/:id",  updateUser)

userRouter.delete("/users/:id", deleteUser)
// search
// userRouter.get("/users/search", searchUsers)
