import Express from "express";
import { createMenuItem, deleteMenuItem, getMenuItem, getMenuItems, updateMenuItem } from "../controllers/menuItem.controller.js";

const menuItemRouter = Express.Router();

// example get: http://localhost:8080/menuItems/
menuItemRouter.get("/", getMenuItems);

// example get: http://localhost:8080/menuItems/3
menuItemRouter.get("/:menuItemID", getMenuItem);

/* example: post with the following object in the body:
{
  "name": "pepperoni pizza",
  "status": "sold-out",
  "description": "pepperoni slices and cheese on a thin crust",
  "price": 10,
  "restaurant": []
}
*/ 
menuItemRouter.post("/", createMenuItem);

/* example patch: localhost:8080/menuItems/8 with body:
{
  "status": "in stock"
}
*/
menuItemRouter.patch("/:menuItemID", updateMenuItem);

// example delete: localhost:8080/menuItems/3
menuItemRouter.delete("/:menuItemID", deleteMenuItem);

export default menuItemRouter;