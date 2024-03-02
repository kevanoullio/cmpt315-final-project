// Code adapted from https://github.com/mrchenliang/learning-node

import { getmenuItemsFromRepository, updatemenuItemsInRepository, deletemenuItemFromRepository, createmenuItemInRepository } from "../repositories/menuItem.repository.js";

export const getmenuItems = async (req, res) => {
  try {
    const menuItems = await getmenuItemsFromRepository();
    res.status(200).send(menuItems);
  } catch (e) {
    console.log("Failed to get menuItems: ", e); 
    res.status(400).send("Get failed");
  }
}

export const getmenuItem = async (req, res) => {
  try {
    const { menuItemID } = req.params;
    const menuItem = await getmenuItemsFromRepository({ id: menuItemID });
    res.status(200).send(menuItem);
  } catch (e) {
    console.log("Failed to get menuItem: ", e); 
    res.status(400).send("Get failed");
  }
}

export const createmenuItem = async (req, res) => {
  try {
    const menuItem = await createmenuItemInRepository( req.body );
    res.status(201).send(menuItem);
  } catch (e) {
    console.log("Failed to create menuItem: ", e); 
    res.status(400).send('Create failed. You likely did not include all required fields: [menuItemname, password, email, address]');
  }
}

export const updatemenuItem = async (req, res) => {
  try {
    const { menuItemID } = req.params;
    const menuItem = await updatemenuItemsInRepository(menuItemID, req);
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

export const deletemenuItem = async (req, res) => {
  const { menuItemID } = req.params;
  try {
    const menuItem = await deletemenuItemFromRepository(menuItemID);
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
