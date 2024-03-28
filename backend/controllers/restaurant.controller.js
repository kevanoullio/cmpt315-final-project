// Code adapted from https://github.com/mrchenliang/learning-node

import {
    getRestaurantsFromRepository,
    updateRestaurantsInRepository,
    updateMenuItemsForRestaurantInRepository,
    deleteRestaurantFromRepository,
    createRestaurantInRepository,
    getAllMenuItems,
} from "../repositories/restaurant.repository.js";

export const getRestaurants = async (req, res) => {
    try {
        const restaurants = await getRestaurantsFromRepository();
        res.status(200).send(restaurants);
    } catch (e) {
        console.log("Failed to get restaurants: ", e);
        res.status(400).send("Get failed");
    }
}

export const getRestaurant = async (req, res) => {
    try {
        const {restaurantID} = req.params;
        const restaurant = await getRestaurantsFromRepository({id: restaurantID});
        res.status(200).send(restaurant);
    } catch (e) {
        console.log("Failed to get restaurant: ", e);
        res.status(400).send("Get failed");
    }
}

export const createRestaurant = async (req, res) => {
    try {
        const restaurant = await createRestaurantInRepository(req.body);
        res.status(201).send(restaurant);
    } catch (e) {
        console.log("Failed to create restaurant: ", e);
        res.status(400).send('Create failed. You likely did not include all required fields: [name, address, phone, email]');
    }
}

export const updateRestaurant = async (req, res) => {
    try {
        const {restaurantID} = req.params;
        const restaurant = await updateRestaurantsInRepository(restaurantID, req);
        // returns -1 if it does not exist in database
        if (restaurant === -1) {
            res.status(400).send("The restaurant you are trying to update with restaurantID " + restaurantID + " likely does not exist.")
        }
        else {
            res.status(200).send(restaurant);
        }
    } catch (e) {
        console.log("Failed to update restaurant: ", e);
        res.status(400).send("Update failed");
    }
}

export const updateMenuItemArray = async (req, res) => {
    try {
        const {restaurantID} = req.params; 
        const { newMenuItemId } = req.body; 
        const restaurant = await updateMenuItemsForRestaurantInRepository(restaurantID, newMenuItemId);
        // returns -1 if it does not exist in database
        if (restaurant === -1) {
            res.status(400).send("The restaurant you are trying to update with restaurantID " + restaurantID + " likely does not exist.")
        }
        else {
            res.status(200).send(restaurant);
        }
    } catch (e) {
        console.log("Failed to update restaurant's menu items: ", e);
        res.status(400).send("Update failed");
    }
}

export const deleteRestaurant = async (req, res) => {
    const {restaurantID} = req.params;
    try {
        const restaurant = await deleteRestaurantFromRepository(restaurantID);
        if (restaurant) {
            res.status(200).send("The following restaurant was deleted: " + restaurant);
        }
        else {
            res.status(400).send("The restaurant you are trying to delete with restaurantID " + restaurantID + " likely does not exist or was already deleted.");
        }
    } catch (e) {
        console.log("Failed to delete restaurant: ", e);
        res.status(400).send("Restaurant delete failed.");
    }
}

export const getMenuItems = async (req, res) => {
    try {
        const {restaurantId} = req.params;
        const menuItems = await getAllMenuItems(restaurantId);
        res.status(200).send(menuItems);
    } catch (e) {
        console.log("Failed to get menu items: ", e);
        res.status(400).send("Get failed");
    }
}
