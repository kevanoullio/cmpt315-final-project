// Code adapted from https://github.com/mrchenliang/learning-node

import { getCustomersFromRepository, updateCustomersInRepository, deleteCustomerFromRepository, createCustomerInRepository } from "../repositories/customer.repository.js";

export const getCustomers = async (req, res) => {
  try {
    const customers = await getCustomersFromRepository();
    res.status(200).send(customers);
  } catch (e) {
    console.log("Failed to get customers: ", e); 
    res.status(400).send("Get failed");
  }
}

export const getCustomer = async (req, res) => {
  try {
    const { customerID } = req.params;
    const customer = await getCustomersFromRepository({ id: customerID });
    res.status(200).send(customer);
  } catch (e) {
    console.log("Failed to get customer: ", e); 
    res.status(400).send("Get failed");
  }
}

export const createCustomer = async (req, res) => {
  try {
    const customer = await createCustomerInRepository( req.body );
    res.status(201).send(customer);
  } catch (e) {
    console.log("Failed to create customer: ", e); 
    res.status(400).send('Create failed. You likely did not include all required fields: [name, email, address]');
  }
}

export const updateCustomer = async (req, res) => {
  try {
    const { customerID } = req.params;
    const customer = await updateCustomersInRepository(customerID, req);
    // returns -1 if it does not exist in database
    if (customer === -1) {
      res.status(400).send("The customer you are trying to update with customerID " + customerID + " likely does not exist.")
    } else {
      res.status(200).send(customer);
    }
  } catch (e) {
    console.log("Failed to update customer: ", e); 
    res.status(400).send("Update failed");
  }
}

export const deleteCustomer = async (req, res) => {
  const { customerID } = req.params;
  try {
    const customer = await deleteCustomerFromRepository(customerID);
    if (customer) {
      res.status(200).send("The following customer was deleted: "+ customer);
    } else {
      res.status(400).send("The customer you are trying to delete with customerID "+ customerID +" likely does not exist or was already deleted.");
    }
  } catch (e) {
    console.log("Failed to delete customer: ", e); 
    res.status(400).send("Customer delete failed.");
  }
}
