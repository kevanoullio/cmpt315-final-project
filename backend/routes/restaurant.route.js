import Express from "express";
import { createRestaurant, deleteRestaurant, getRestaurant, getRestaurants, updateRestaurant } from "../controllers/restaurant.controller.js";

const restaurantRouter = Express.Router();

// example get: http://localhost:8080/restaurants/
restaurantRouter.get("/", getRestaurants);

// example get: http://localhost:8080/restaurants/3
restaurantRouter.get("/:restaurantID", getRestaurant);

/* example: post with the following object in the body:
{
  "name": "Pizza Palace",
  "address": "101 5th Ave Edmonton, AB",
  "phone": "7804445656",
  "email": "pizzapalace@email.com",
  "menuItems": []
}
*/ 
restaurantRouter.post("/", createRestaurant);

/* example patch: localhost:8080/restaurants/8 with body:
{
  "phone": "7805556464"
}
*/
restaurantRouter.patch("/:restaurantID", updateRestaurant);

// example delete: localhost:8080/restaurants/3
restaurantRouter.delete("/:restaurantID", deleteRestaurant);

export default restaurantRouter;