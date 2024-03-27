import Express from "express";
import {
  createManager,
  deleteManager,
  getGrossSales,
  getManager,
  getManagers,
  updateManager
} from "../controllers/manager.controller.js";

const managerRouter = Express.Router();

// example get: http://localhost:8080/managers/
managerRouter.get("/", getManagers);

// example get: http://localhost:8080/managers/3
managerRouter.get("/:managerID", getManager);

/* example: post with the following object in the body:
{
  "name": "Zach",
  "email": "zach@zach.com"
}
*/
managerRouter.post("/", createManager);

/* example patch: localhost:8080/managers/8 with body
{
  "name": "updated name"
}
*/
managerRouter.patch("/:managerID", updateManager);

// example delete: localhost:8080/managers/3
managerRouter.delete("/:managerID", deleteManager);

managerRouter.get("/:managerID/gross-sales", getGrossSales);

export default managerRouter;
