// Code adapted from https://github.com/mrchenliang/learning-node

import MenuItem from "../models/menuItem.model.js";

export const getMenuItemsFromRepository = async (query) => {
  try {
    const menuItems = await MenuItem.find(query);
    return menuItems;
  } catch (e) {
    throw Error(`Error while fetching menuItems: ${e}`);
  }
}


export const updateMenuItemsInRepository = async (menuItemID, query) => {
  let exists = await menuItemExists(menuItemID);
  if (!exists) {
    return -1;
  }
  try {
    const menuItem = await MenuItem.findOneAndUpdate(
      { id: menuItemID },
      { $set: query.body },
      { new: true }
    ).lean();
    return menuItem;
  } catch (e) {
    throw Error(`Error while updating menuItem: ${e}`);
  }
}

export const deleteMenuItemFromRepository = async (menuItemID) => {
  try {
    const menuItem = await MenuItem.findOneAndDelete({ id: menuItemID });
    return menuItem;
  } catch (e) {
    throw Error(`Error while deleting a menuItem: ${e}`);
  }
}

export const deleteAllMenuItems = async () => {
  try {
    return await MenuItem.deleteMany({});
  } catch (e) {
    throw Error(`Error while deleting all menuItems: ${e}`);
  }
}

export const createMenuItemInRepository = async (payload) => {
  try {
    // get a new id
    const newId = await getUniqueMenuItemID();
    // add it to the payload obj
    payload = { ...payload, id: newId };
    // then add to db
    const newMenuItem = new MenuItem(payload);
    return await newMenuItem.save();
  } catch (e) {
    throw Error(`Error while creating a menuItem: ${e}`);
  }
}


// ------------- Helper functions ------------- //

// This func gets the highest id in the database and increments it by one so its always a unique id
const getUniqueMenuItemID = async () => {
  const maxIdDocument = await MenuItem.findOne({}, { id: 1 }).sort({ id: -1 });
  const maxId = maxIdDocument ? maxIdDocument.id : 0;
  return maxId + 1;
}

// Function to check if a menuItem exists
const menuItemExists = async (menuItemID) => {
  const menuItem = await MenuItem.findOne({ id: menuItemID });
  return menuItem ? true : false;
}

// const itemsToOrder = await MenuItem.find({id: {$in: menuItems}})
// Validates menu items existence and status.
export const validateMenuItem = async (menuItems) => {
  // await Tank.find({ size: 'small' }).where('createdDate').gt(oneYearAgo).exec();
  const itemsToOrder = await MenuItem.find({ id: { $in: menuItems } });

  // Verify all requested items exist
  for (const item of menuItems) {
    if (!menuItemExists(item)) {
      throw new Error("One or more menu items do not exist.");
    }
  }

  // Verify all requested items have sufficient status (available)
  if (itemsToOrder.some(item => item.status !== 'in stock')) {
    throw new Error("One or more menu items are sold out or not available.");
  }

  return itemsToOrder.map(item => item._id);
}
