// Code adapted from https://github.com/mrchenliang/learning-node

import menuItem from "../models/menuItem.model.js";

export const getmenuItemsFromRepository = async (query) => {
  try {
    const menuItems = await menuItem.find(query);
    return menuItems;
  } catch (e) {
    throw Error("Error while fetching menuItems: ", e);
  }
}

const menuItemExists = async (menuItemID) => {
  const menuItem = await menuItem.findOne({ id: menuItemID });
  return menuItem ? true : false;
}

export const updatemenuItemsInRepository = async (menuItemID, query) => {
  let exists = await menuItemExists(menuItemID);
  if (!exists) {
    return -1;
  }
  try {
    const menuItem = await menuItem.findOneAndUpdate(
      { id: menuItemID },
      { $set: query.body },
      { new: true }
    ).lean();
    return menuItem;
  } catch (e) {
    throw Error("Error while updating menuItem: ", e);
  } 
}

export const deletemenuItemFromRepository = async (menuItemID) => {
  try {
    const menuItem = await menuItem.findOneAndDelete({ id: menuItemID });
    return menuItem;
  } catch (e) {
    throw Error("Error while deleting a menuItem: ", e);
  }
}


// This func gets the highest id in the database and increments it by one so its always a unique id
const getUniquemenuItemID = async () => {
  const maxIdDocument = await menuItem.findOne({}, { id: 1 }).sort({ id: -1 });
  const maxId = maxIdDocument ? maxIdDocument.id : 0;
  return maxId + 1;
}


export const createmenuItemInRepository = async (payload) => {
  try {
    // get a new id
    const newId = await getUniquemenuItemID();
    console.log("newId", newId)
    // add it to the payload obj
    payload = {...payload, id: newId};
    // then add to db
    const newmenuItem = new menuItem(payload);
    const savedmenuItem = await newmenuItem.save();
    return savedmenuItem;
  } catch (e) {
    throw Error("Error while creating a menuItem: ", e);
  }
}
