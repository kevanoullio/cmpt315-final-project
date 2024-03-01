import Express from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "../controllers/user.controller.js";

const userRouter = Express.Router();

// example get: http://localhost:8080/users/
userRouter.get("/", getUsers);

// example get: http://localhost:8080/users/3
userRouter.get("/:userID", getUser);

/* example: post with the following object in the body:
{
  "name": "Zach",
  "email": "zach@zach.com"
}
*/ 
userRouter.post("/", createUser);

/* example patch: localhost:8080/users/8 with body
{
  "name": "updated name"
}
*/
userRouter.patch("/:userID", updateUser);

// example delete: localhost:8080/users/3
userRouter.delete("/:userID", deleteUser);

export default userRouter;
