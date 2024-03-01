// Code adapted from https://github.com/mrchenliang/learning-node

import User from "../models/user.model.js";

export const getUsersFromRepository = async (query) => {
  try {
    const users = await User.find(query);
    return users;
  } catch (e) {
    throw Error("Error while fetching users: ", e);
  }
}

const userExists = async (userID) => {
  const user = await User.findOne({ id: userID });
  return user ? true : false;
}

export const updateUsersInRepository = async (userID, query) => {
  let exists = await userExists(userID);
  if (!exists) {
    return -1;
  }
  try {
    const user = await User.findOneAndUpdate(
      { id: userID },
      { $set: query.body },
      { new: true }
    ).lean();
    return user;
  } catch (e) {
    throw Error("Error while updating user: ", e);
  } 
}

export const deleteUserFromRepository = async (userID) => {
  try {
    const user = await User.findOneAndDelete({ id: userID });
    return user;
  } catch (e) {
    throw Error("Error while deleting a user: ", e);
  }
}


// This func gets the highest id in the database and increments it by one so its always a unique id
const getUniqueUserID = async () => {
  const maxIdDocument = await User.findOne({}, { id: 1 }).sort({ id: -1 });
  const maxId = maxIdDocument ? maxIdDocument.id : 0;
  return maxId + 1;
}


export const createUserInRepository = async (payload) => {
  try {
    // get a new id
    const newId = await getUniqueUserID();
    console.log("newId", newId)
    // add it to the payload obj
    payload = {...payload, id: newId};
    // then add to db
    const newUser = new User(payload);
    const savedUser = await newUser.save();
    return savedUser;
  } catch (e) {
    throw Error("Error while creating a user: ", e);
  }
}
