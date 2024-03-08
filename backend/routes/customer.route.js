import Express from "express";
import { createCustomer, deleteCustomer, getCustomer, getCustomers, updateCustomer } from "../controllers/customer.controller.js";

const customerRouter = Express.Router();

// example get: http://localhost:8080/customers/
customerRouter.get("/", getCustomers);

// example get: http://localhost:8080/customers/3
customerRouter.get("/:customerID", getCustomer);

/* example: post with the following object in the body:
{
  "name": "Zach",
  "email": "zach@zach.com"
}
*/ 
customerRouter.post("/", createCustomer);

/* example patch: localhost:8080/customers/8 with body
{
  "name": "updated name"
}
*/
customerRouter.patch("/:customerID", updateCustomer);

// example delete: localhost:8080/customers/3
customerRouter.delete("/:customerID", deleteCustomer);

export default customerRouter;
