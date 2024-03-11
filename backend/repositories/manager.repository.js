// Code adapted from https://github.com/mrchenliang/learning-node

import Manager from "../models/manager.model.js";
import { validateRestaurant } from "./restaurant.repository.js";

export const getManagersFromRepository = async (query) => {
  try {
    const managers = await Manager.find(query).populate("restaurantId");
    return managers;
  } catch (e) {
    throw Error("Error while fetching managers: ", e);
  }
}

export const updateManagersInRepository = async (managerID, query) => {
  let exists = await managerExists(managerID);
  if (!exists) {
    return -1;
  }
  try {
    const manager = await Manager.findOneAndUpdate(
      { id: managerID },
      { $set: query.body },
      { new: true }
    ).lean();
    return manager;
  } catch (e) {
    throw Error("Error while updating manager: ", e);
  } 
}

export const deleteManagerFromRepository = async (managerID) => {
  try {
    const manager = await Manager.findOneAndDelete({ id: managerID });
    return manager;
  } catch (e) {
    throw Error("Error while deleting a manager: ", e);
  }
}

export const createManagerInRepository = async ({ name, email, address, restaurantId }) => {
  try {
    // input validation
    const restaurantObjectId = await validateRestaurant(restaurantId);

    // Generate a unique ID for the new manager
    const newManagerId = await getUniqueManagerID();

    const newManager = new Manager({
      id: newManagerId,
      name,
      email,
      address,
      restaurantId: restaurantObjectId
    });

    // Save the new manager
    const savedManager = await newManager.save();
    return savedManager;
  } catch (error) {
    throw new Error("Error creating manager: " + error.message);
  }
}


// ------------- Helper functions ------------- //
  
// This func gets the highest id in the database and increments it by one so its always a unique id
const getUniqueManagerID = async () => {
  const maxIdDocument = await Manager.findOne({}, { id: 1 }).sort({ id: -1 });
  const maxId = maxIdDocument ? maxIdDocument.id : 0;
  return maxId + 1;
}

// Function to check if a manager exists
const managerExists = async (managerID) => {
  const manager = await Manager.findOne({ id: managerID });
  return manager ? true : false;
}

// Function to validate a manager
export const validateManager = async (pmanagerId) => {
  const manager = await Manager.findOne({ id: pmanagerId });
  if (!manager) throw Error("Manager does not exist");
  return manager._id;
}
