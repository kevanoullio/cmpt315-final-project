import Express from "express";
import { createmenuItem, deletemenuItem, getmenuItem, getmenuItems, updatemenuItem } from "../controllers/menuItem.controller.js";

const menuItemRouter = Express.Router();

// example get: http://localhost:8080/menuItems/
menuItemRouter.get("/", getmenuItems);

// example get: http://localhost:8080/menuItems/3
menuItemRouter.get("/:menuItemID", getmenuItem);

/* example: post with the following object in the body:
{
  "name": "pepperoni pizza",
  "status": "sold-out",
  "description": "pepperoni slices and cheese on a thin crust",
  "price": 10,
  "restaurant": []
}
*/ 
menuItemRouter.post("/", createmenuItem);

/* example patch: localhost:8080/menuItems/8 with body:
{
  "status": "in stock"
}
*/
menuItemRouter.patch("/:menuItemID", updatemenuItem);

// example delete: localhost:8080/menuItems/3
menuItemRouter.delete("/:menuItemID", deletemenuItem);

export default menuItemRouter;