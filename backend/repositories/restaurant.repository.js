// Code adapted from https://github.com/mrchenliang/learning-node

import Restaurant from "../models/restaurant.model.js";
import MenuItem from "../models/menuItem.model.js";

export const getRestaurantsFromRepository = async (query) => {
    try {
        const restaurants = await Restaurant.find(query);
        return restaurants;
    } catch (e) {
        throw Error(`Error while fetching restaurants: ${e}`);
    }
}

export const updateRestaurantsInRepository = async (restaurantID, query) => {
    let exists = await restaurantExists(restaurantID);
    if (!exists) {
        return -1;
    }
    try {
        const restaurant = await Restaurant.findOneAndUpdate(
          {id: restaurantID},
          {$set: query.body},
          {new: true}
        ).lean();
        return restaurant;
    } catch (e) {
        throw Error(`Error while updating restaurant: ${e}`);
    }
}

export const updateMenuItemsForRestaurantInRepository = async (restaurantID, newMenuItemId) => {
    let exists = await restaurantExists(restaurantID);
    if (!exists) {
        return -1;
    }
    try {
        const restaurant = await Restaurant.findOneAndUpdate(
          { id: restaurantID },
          { $push: { menuItems: newMenuItemId } },
          { new: true }
        ).lean();
        return restaurant;
    } catch (e) {
        throw Error(`Error while updating restaurant: ${e}`);
    }
}


export const deleteMenuItemFromRestaurantInRepository = async (restaurantID, menuItemId) => {
    let exists = await restaurantExists(restaurantID);
    if (!exists) {
        return -1;
    }
    try {
        const restaurant = await Restaurant.findOneAndUpdate(
          { id: restaurantID },
          { $pull: { menuItems: menuItemId } }, 
          { new: true }
        ).lean();
        return restaurant;
    } catch (e) {
        throw Error(`Error while updating restaurant's menu items: ${e}`);
    }
}

export const deleteRestaurantFromRepository = async (restaurantID) => {
    try {
        const restaurant = await Restaurant.findOneAndDelete({id: restaurantID});
        return restaurant;
    } catch (e) {
        throw Error(`Error while deleting a restaurant: ${e}`);
    }
}

export const deleteAllRestaurants = async () => {
    try {
        return await Restaurant.deleteMany({});
    } catch (e) {
        throw Error(`Error while deleting all restaurants: ${e}`);
    }
}

export const getAllMenuItems = async (restaurantId) => {
    try {
        const newVar = await Restaurant.findOne({id: restaurantId}, {menuItems: 1});
        // get their actual names
        const menuItems = await MenuItem.find({id: {$in: newVar.menuItems}});
        return menuItems;
    } catch (e) {
        throw Error(`Error while fetching menu items: ${e}`);
    }
}

export const createRestaurantInRepository = async (payload) => {
    try {
        // get a new id
        const newId = await getUniqueRestaurantID();
        // add it to the payload obj
        payload = {...payload, id: newId};
        // then add to db
        const newRestaurant = new Restaurant(payload);
        const savedRestaurant = await newRestaurant.save();
        return savedRestaurant;
    } catch (e) {
        throw Error(`Error while creating a restaurant: ${e}`);
    }
}


// ------------- Helper functions ------------- //

// This func gets the highest id in the database and increments it by one so its always a unique id
const getUniqueRestaurantID = async () => {
    const maxIdDocument = await Restaurant.findOne({}, {id: 1}).sort({id: -1});
    const maxId = maxIdDocument ? maxIdDocument.id : 0;
    return maxId + 1;
}

// Function to check if a restaurant exists
const restaurantExists = async (restaurantID) => {
    const restaurant = await Restaurant.findOne({id: restaurantID});
    return restaurant ? true : false;
}

// Function to validate a restaurant
export const validateRestaurant = async (restaurantId) => {
    const restaurant = await Restaurant.findOne({id: restaurantId})
    if (!restaurant) throw new Error("Invalid Restaurant");
    return restaurant._id;
}
