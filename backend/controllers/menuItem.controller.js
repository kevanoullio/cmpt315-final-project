// Code adapted from https://github.com/mrchenliang/learning-node

import { getMenuItemsFromRepository, updateMenuItemsInRepository, deleteMenuItemFromRepository, createMenuItemInRepository } from "../repositories/menuItem.repository.js";

export const getMenuItems = async (req, res) => {
  try {
    const menuItems = await getMenuItemsFromRepository();
    res.status(200).send(menuItems);
  } catch (e) {
    console.log("Failed to get menuItems: ", e); 
    res.status(400).send("Get failed");
  }
}

export const getMenuItem = async (req, res) => {
  try {
    const { menuItemID } = req.params;
    const menuItem = await getMenuItemsFromRepository({ id: menuItemID });
    res.status(200).send(menuItem);
  } catch (e) {
    console.log("Failed to get menuItem: ", e); 
    res.status(400).send("Get failed");
  }
}

export const createMenuItem = async (req, res) => {
  try {
    const menuItem = await createMenuItemInRepository( req.body );
    res.status(201).send(menuItem);
  } catch (e) {
    console.log("Failed to create menuItem: ", e); 
    res.status(400).send('Create failed. You likely did not include all required fields: [name, status, description, price]');
  }
}

export const updateMenuItem = async (req, res) => {
  try {
    const { menuItemID } = req.params;
    const menuItem = await updateMenuItemsInRepository(menuItemID, req);
    // returns -1 if it does not exist in database
    if (menuItem === -1) {
      res.status(400).send("The menuItem you are trying to update with menuItemID " + menuItemID + " likely does not exist.")
    } else {
      res.status(200).send(menuItem);
    }
  } catch (e) {
    console.log("Failed to update menuItem: ", e); 
    res.status(400).send("Update failed");
  }
}

export const deleteMenuItem = async (req, res) => {
  const { menuItemID } = req.params;
  try {
    const menuItem = await deleteMenuItemFromRepository(menuItemID);
    if (menuItem) {
      res.status(200).send("The following menuItem was deleted: "+ menuItem);
    } else {
      res.status(400).send("The menuItem you are trying to delete with menuItemID "+ menuItemID +" likely does not exist or was already deleted.");
    }
  } catch (e) {
    console.log("Failed to delete menuItem: ", e); 
    res.status(400).send("menuItem delete failed.");
  }
}
