import Express from "express";
import * as fs from "fs";
import {
    createCustomerInRepository, deleteAllCustomers,
} from "../repositories/customer.repository.js";
import {
    createMenuItemInRepository, deleteAllMenuItems
} from "../repositories/menuItem.repository.js";
import {
    createRestaurantInRepository, deleteAllRestaurants
} from "../repositories/restaurant.repository.js";
import {createOrder, deleteAllOrders} from "../repositories/order.repository.js";
import {
    createManagerInRepository, deleteAllManagers
} from "../repositories/manager.repository.js";

const preloadRouter = Express.Router();

preloadRouter.get("/", async (req, res) => {
    try {
        await loadCustomers()
        await loadMenuItems()
        await loadRestaurants()
        await loadOrders()
        await loadMangers()
        res.status(200).send("Preloaded data");
    } catch (error) {
        res.status(500).send("Error preloading data: " + error.message);
    }
});

const loadCustomers = async () => {
    await deleteAllCustomers();
    return new Promise((resolve, reject) => {
        fs.readFile('jsonData/customers.json', 'utf8', async (err, data) => {
            if (err) {
                reject("Error reading file");
                return;
            }

            const customers = JSON.parse(data)
            for (const customer of customers) {
                await createCustomerInRepository(customer)
            }
            resolve();
        });
    });
}

const loadMenuItems = async () => {
    await deleteAllMenuItems();
    return new Promise((resolve, reject) => {
        fs.readFile('jsonData/menuItems.json', 'utf8', async (err, data) => {
            if (err) {
                reject("Error reading file");
                return;
            }

            const menuItems = JSON.parse(data)
            for (const menuItem of menuItems) {
                await createMenuItemInRepository(menuItem)
            }
            resolve();
        });
    });
}

const loadRestaurants = async () => {
    await deleteAllRestaurants();
    return new Promise((resolve, reject) => {
        fs.readFile('jsonData/restaurants.json', 'utf8', async (err, data) => {
            if (err) {
                reject("Error reading file");
                return;
            }

            const restaurants = JSON.parse(data)
            for (const restaurant of restaurants) {
                await createRestaurantInRepository(restaurant)
            }
            resolve();
        });
    });
}

const loadOrders = async () => {
    await deleteAllOrders();
    return new Promise((resolve, reject) => {
        fs.readFile('jsonData/orders.json', 'utf8', async (err, data) => {
            if (err) {
                reject("Error reading file");
                return;
            }

            const orders = JSON.parse(data)
            for (const order of orders) {
                await createOrder(order)
            }
            resolve();
        });
    });
}

const loadMangers = async () => {
    await deleteAllManagers();
    return new Promise((resolve, reject) => {
        fs.readFile('jsonData/managers.json', 'utf8', async (err, data) => {
            if (err) {
                reject("Error reading file");
                return;
            }

            const managers = JSON.parse(data)
            for (const manager of managers) {
                await createManagerInRepository(manager)
            }
            resolve();
        });
    });
}


export default preloadRouter;