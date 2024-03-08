// Code adapted from https://github.com/mrchenliang/learning-node

import Manager from "../models/manager.model.js";

export const getManagersFromRepository = async (query) => {
  try {
    const managers = await Manager.find(query);
    return managers;
  } catch (e) {
    throw Error("Error while fetching managers: ", e);
  }
}

const managerExists = async (managerID) => {
  const manager = await Manager.findOne({ id: managerID });
  return manager ? true : false;
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


// This func gets the highest id in the database and increments it by one so its always a unique id
const getUniqueManagerID = async () => {
  const maxIdDocument = await Manager.findOne({}, { id: 1 }).sort({ id: -1 });
  const maxId = maxIdDocument ? maxIdDocument.id : 0;
  return maxId + 1;
}


export const createManagerInRepository = async (payload) => {
  try {
    // get a new id
    const newId = await getUniqueManagerID();
    console.log("newId", newId)
    // add it to the payload obj
    payload = {...payload, id: newId};
    // then add to db
    const newManager = new Manager(payload);
    const savedManager = await newManager.save();
    return savedManager;
  } catch (e) {
    throw Error("Error while creating a manager: ", e);
  }
}
