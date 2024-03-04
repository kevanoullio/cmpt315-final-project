// Code adapted from https://github.com/mrchenliang/learning-node

import { getUsersFromRepository, updateUsersInRepository, deleteUserFromRepository, createUserInRepository } from "../repositories/user.repository.js";

export const getUsers = async (req, res) => {
  try {
    const users = await getUsersFromRepository();
    res.status(200).send(users);
  } catch (e) {
    console.log("Failed to get users: ", e); 
    res.status(400).send("Get failed");
  }
}

export const getUser = async (req, res) => {
  try {
    const { userID } = req.params;
    const user = await getUsersFromRepository({ id: userID });
    res.status(200).send(user);
  } catch (e) {
    console.log("Failed to get user: ", e); 
    res.status(400).send("Get failed");
  }
}

export const createUser = async (req, res) => {
  try {
    const user = await createUserInRepository( req.body );
    res.status(201).send(user);
  } catch (e) {
    console.log("Failed to create user: ", e); 
    res.status(400).send('Create failed. You likely did not include all required fields: [name, email, address]');
  }
}

export const updateUser = async (req, res) => {
  try {
    const { userID } = req.params;
    const user = await updateUsersInRepository(userID, req);
    // returns -1 if it does not exist in database
    if (user === -1) {
      res.status(400).send("The user you are trying to update with userID " + userID + " likely does not exist.")
    } else {
      res.status(200).send(user);
    }
  } catch (e) {
    console.log("Failed to update user: ", e); 
    res.status(400).send("Update failed");
  }
}

export const deleteUser = async (req, res) => {
  const { userID } = req.params;
  try {
    const user = await deleteUserFromRepository(userID);
    if (user) {
      res.status(200).send("The following user was deleted: "+ user);
    } else {
      res.status(400).send("The user you are trying to delete with userID "+ userID +" likely does not exist or was already deleted.");
    }
  } catch (e) {
    console.log("Failed to delete user: ", e); 
    res.status(400).send("User delete failed.");
  }
}
