// Code adapted from https://github.com/mrchenliang/learning-node

import {
  getManagersFromRepository,
  updateManagersInRepository,
  deleteManagerFromRepository,
  createManagerInRepository
} from "../repositories/manager.repository.js";
import {fetchOrdersByRestaurant} from "../repositories/order.repository.js";

const months = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

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
    const {managerID} = req.params;
    const manager = await getManagersFromRepository({id: managerID});
    res.status(200).send(manager);
  } catch (e) {
    console.log("Failed to get manager: ", e);
    res.status(400).send("Get failed");
  }
}

export const createManager = async (req, res) => {
  try {
    const manager = await createManagerInRepository(req.body);
    res.status(201).send(manager);
  } catch (e) {
    console.log("Failed to create manager: ", e);
    res.status(400).send('Create failed. You likely did not include all required fields: [name, email, address, restaurantId]');
  }
}

export const updateManager = async (req, res) => {
  try {
    const {managerID} = req.params;
    const manager = await updateManagersInRepository(managerID, req);
    // returns -1 if it does not exist in database
    if (manager === -1) {
      res.status(400).send("The manager you are trying to update with managerID " + managerID + " likely does not exist.")
    }
    else {
      res.status(200).send(manager);
    }
  } catch (e) {
    console.log("Failed to update manager: ", e);
    res.status(400).send("Update failed");
  }
}

export const deleteManager = async (req, res) => {
  const {managerID} = req.params;
  try {
    const manager = await deleteManagerFromRepository(managerID);
    if (manager) {
      res.status(200).send("The following manager was deleted: " + manager);
    }
    else {
      res.status(400).send("The manager you are trying to delete with managerID " + managerID + " likely does not exist or was already deleted.");
    }
  } catch (e) {
    console.log("Failed to delete manager: ", e);
    res.status(400).send("Manager delete failed.");
  }
}

export const getGrossSales = async (req, res) => {
  try {
    const {managerID} = req.params;
    // Get manager, and get all the orders from the restaurant (manager's restaurant)
    const [manager] = await getManagersFromRepository({id: managerID});
    const managerOrders = await fetchOrdersByRestaurant(manager.restaurantId.id);

    let grossSales = {};
    for (let order of managerOrders) {
      // get month E.g. August
      const month = order.pickupTime.toLocaleString('default', {month: 'long'});
      if (!grossSales[month]) { // add month to grossSales if it does not exist
        grossSales[month] = 0;
      }
      const menuItems = order.menuItems;
      for (const menuItem of menuItems) { // add up the price of each menuItem
        grossSales[month] += menuItem.price;
      }
    }
    // Convert to array
    const result = Object.keys(grossSales).map((key) => {
      return {month: key, grossSale: grossSales[key].toFixed(2)}
    });

    res.status(200).send(sortByMonth(result));
  } catch (e) {
    console.log("Error occurred while calculating gross sales: ", e);
    res.status(400).send("Get failed");
  }
}

export const getMostSoldItem = async (req, res) => {
  try {
    const {managerID} = req.params;
    const [manager] = await getManagersFromRepository({id: managerID});
    const managerOrders = await fetchOrdersByRestaurant(manager.restaurantId.id);

    // Find most sold item in each month
    let mostSoldItems = {};
    for (let order of managerOrders) {
      const month = order.pickupTime.toLocaleString('default', {month: 'long'});
      if (!mostSoldItems[month]) {
        // object to store each item and its count
        // an object of object
        mostSoldItems[month] = {};
      }
      const menuItems = order.menuItems;
      for (const menuItem of menuItems) {
        // if the item does not exist in the month, add it
        if (!mostSoldItems[month][menuItem.name]) {
          mostSoldItems[month][menuItem.name] = 0;
        }
        // increment the count
        mostSoldItems[month][menuItem.name]++;
      }
    }
    /*
     At this point, mostSoldItems is an object of objects that looks like:
     {
        March: {
          'Pepperoni Pizza': 1,
          'Margherita Pizza': 1,
          'Vegetarian Pizza': 2,
          'Meat Lovers Pizza': 2
        },
        February: {
          'Vegetarian Pizza': 1,
          'Meat Lovers Pizza': 1
        },
        January: {
          'Vegetarian Pizza': 1,
          'Meat Lovers Pizza': 1
        }
     }
     For each month, the menu item that has the highest count will be returned
     If there are multiple items with the same count, they will all be returned in a
     single string
     The amount will also be returned
    */
    const result = Object.keys(mostSoldItems).map((key) => {
      let mostSoldItem = "";
      let amount = 0;
      const month = mostSoldItems[key];
      for (const item in month) {
        if (month[item] > amount) {
          mostSoldItem = item;
          amount = month[item];
        }
        else if (month[item] === amount) {
          mostSoldItem += ", " + item;
        }
      }
      return {month: key, item: mostSoldItem, amount: amount};
    });

    console.log(result);
    res.status(200).send(sortByMonth(result));
  } catch (e) {
    console.log("Error occurred while calculating gross sales: ", e);
    res.status(400).send("Get failed");
  }
}

export const getBusiestTimeForEachMonth = async (req, res) => {
  // Returns {month: "January", hour: 12 am, numOrders: 2}
  try {
    const {managerID} = req.params;
    const [manager] = await getManagersFromRepository({id: managerID});
    const managerOrders = await fetchOrdersByRestaurant(manager.restaurantId.id);

    let busiestTime = {};
    for (let order of managerOrders) {
      const month = order.pickupTime.toLocaleString('default', {month: 'long'});
      if (!busiestTime[month]) {
        busiestTime[month] = {};
      }
      const hour = order.pickupTime.getUTCHours();
      if (!busiestTime[month][hour]) {
        busiestTime[month][hour] = 0;
      }
      busiestTime[month][hour]++;
    }

    const result = Object.keys(busiestTime).map((key) => {
      let maxHour = 0;
      let maxOrders = 0;
      const month = busiestTime[key];
      for (const hour in month) {
        if (month[hour] > maxOrders) {
          maxHour = hour;
          maxOrders = month[hour];
        }
      }
      // convert hour to AM/PM
      if (maxHour > 12) {
        maxHour = maxHour - 12 + " p.m.";
      }
      else if (maxHour === 12) {
        maxHour = maxHour + " p.m.";
      }
      else {
        maxHour = maxHour + " a.m.";
      }

      return {month: key, hour: maxHour, numOrders: maxOrders};
    });

    res.status(200).send(sortByMonth(result));
  } catch (e) {
    console.log("Error occurred while calculating busiest time: ", e);
    res.status(400).send("Get failed");
  }
}


const sortByMonth = (toSort) => {
  return toSort.sort((a, b) => {
    return months.indexOf(a.month) - months.indexOf(b.month);
  });
}
