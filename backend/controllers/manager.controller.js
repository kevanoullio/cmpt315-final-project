// Code adapted from https://github.com/mrchenliang/learning-node

import { getManagersFromRepository, updateManagersInRepository, deleteManagerFromRepository, createManagerInRepository } from "../repositories/manager.repository.js";

export const getManagers = async (req, res) => {
  try {
    const managers = await getManagersFromRepository();
    res.status(200).send(managers);
  } catch (e) {
    console.log("Failed to get managers: ", e); 
    res.status(400).send("Get failed");
  }
}

export const getManager = async (req, res) => {
  try {
    const { managerID } = req.params;
    const manager = await getManagersFromRepository({ id: managerID });
    res.status(200).send(manager);
  } catch (e) {
    console.log("Failed to get manager: ", e); 
    res.status(400).send("Get failed");
  }
}

export const createManager = async (req, res) => {
  try {
    const manager = await createManagerInRepository( req.body );
    res.status(201).send(manager);
  } catch (e) {
    console.log("Failed to create manager: ", e); 
    res.status(400).send('Create failed. You likely did not include all required fields: [name, email, address, restaurantId]');
  }
}

export const updateManager = async (req, res) => {
  try {
    const { managerID } = req.params;
    const manager = await updateManagersInRepository(managerID, req);
    // returns -1 if it does not exist in database
    if (manager === -1) {
      res.status(400).send("The manager you are trying to update with managerID " + managerID + " likely does not exist.")
    } else {
      res.status(200).send(manager);
    }
  } catch (e) {
    console.log("Failed to update manager: ", e); 
    res.status(400).send("Update failed");
  }
}

export const deleteManager = async (req, res) => {
  const { managerID } = req.params;
  try {
    const manager = await deleteManagerFromRepository(managerID);
    if (manager) {
      res.status(200).send("The following manager was deleted: "+ manager);
    } else {
      res.status(400).send("The manager you are trying to delete with managerID "+ managerID +" likely does not exist or was already deleted.");
    }
  } catch (e) {
    console.log("Failed to delete manager: ", e); 
    res.status(400).send("Manager delete failed.");
  }
}
