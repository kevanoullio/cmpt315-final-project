// Code adapted from https://github.com/mrchenliang/learning-node

import Customer from "../models/customer.model.js";

export const getCustomersFromRepository = async (query) => {
  try {
    const customers = await Customer.find(query);
    return customers;
  } catch (e) {
    throw Error("Error while fetching customers: ", e);
  }
}

export const updateCustomersInRepository = async (customerID, query) => {
  let exists = await customerExists(customerID);
  if (!exists) {
    return -1;
  }
  try {
    const customer = await Customer.findOneAndUpdate(
      { id: customerID },
      { $set: query.body },
      { new: true }
    ).lean();
    return customer;
  } catch (e) {
    throw Error("Error while updating customer: ", e);
  } 
}

export const deleteCustomerFromRepository = async (customerID) => {
  try {
    const customer = await Customer.findOneAndDelete({ id: customerID });
    return customer;
  } catch (e) {
    throw Error("Error while deleting a customer: ", e);
  }
}

export const createCustomerInRepository = async (payload) => {
  try {
    // get a new id
    const newId = await getUniqueCustomerID();
    console.log("newId", newId)
    // add it to the payload obj
    payload = {...payload, id: newId};
    // then add to db
    const newCustomer = new Customer(payload);
    const savedCustomer = await newCustomer.save();
    return savedCustomer;
  } catch (e) {
    throw Error("Error while creating a customer: ", e);
  }
}


// ------------- Helper functions ------------- //
    
// This func gets the highest id in the database and increments it by one so its always a unique id
const getUniqueCustomerID = async () => {
  const maxIdDocument = await Customer.findOne({}, { id: 1 }).sort({ id: -1 });
  const maxId = maxIdDocument ? maxIdDocument.id : 0;
  return maxId + 1;
}

// Function to check if a customer exists
const customerExists = async (customerID) => {
  const customer = await Customer.findOne({ id: customerID });
  return customer ? true : false;
}

// Function to validate a customer
export const validateCustomer = async (customerId) => {
    const customer = await Customer.findOne({ id: customerId });
    if (!customer) throw new Error("Invalid Customer");
    return customer._id;
}
