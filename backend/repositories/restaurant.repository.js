// Code adapted from https://github.com/mrchenliang/learning-node

import restaurant from "../models/restaurant.model.js";

export const getRestaurantsFromRepository = async (query) => {
  try {
    const restaurants = await restaurant.find(query);
    return restaurants;
  } catch (e) {
    throw Error("Error while fetching restaurants: ", e);
  }
}

const restaurantExists = async (restaurantID) => {
  const restaurant = await restaurant.findOne({ id: restaurantID });
  return restaurant ? true : false;
}

export const updateRestaurantsInRepository = async (restaurantID, query) => {
  let exists = await restaurantExists(restaurantID);
  if (!exists) {
    return -1;
  }
  try {
    const restaurant = await restaurant.findOneAndUpdate(
      { id: restaurantID },
      { $set: query.body },
      { new: true }
    ).lean();
    return restaurant;
  } catch (e) {
    throw Error("Error while updating restaurant: ", e);
  } 
}

export const deleteRestaurantFromRepository = async (restaurantID) => {
  try {
    const restaurant = await restaurant.findOneAndDelete({ id: restaurantID });
    return restaurant;
  } catch (e) {
    throw Error("Error while deleting a restaurant: ", e);
  }
}


// This func gets the highest id in the database and increments it by one so its always a unique id
const getUniqueRestaurantID = async () => {
  const maxIdDocument = await restaurant.findOne({}, { id: 1 }).sort({ id: -1 });
  const maxId = maxIdDocument ? maxIdDocument.id : 0;
  return maxId + 1;
}


export const createRestaurantInRepository = async (payload) => {
  try {
    // get a new id
    const newId = await getUniqueRestaurantID();
    console.log("newId", newId)
    // add it to the payload obj
    payload = {...payload, id: newId};
    // then add to db
    const newRestaurant = new restaurant(payload);
    const savedRestaurant = await newRestaurant.save();
    return savedRestaurant;
  } catch (e) {
    throw Error("Error while creating a restaurant: ", e);
  }
}
