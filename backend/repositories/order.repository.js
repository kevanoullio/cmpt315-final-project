import Order from '../models/order.model.js';
import {validateMenuItem} from './menuItem.repository.js';
import {validateRestaurant} from './restaurant.repository.js';
import {validateCustomer} from './customer.repository.js';
import Customer from "../models/customer.model.js";

export const createOrder = async ({customerId, restaurantId, menuItems, pickupTime}) => {
    try {
        // input validation
        const restaurantObjectId = await validateRestaurant(restaurantId);
        const customerObjectId = await validateCustomer(customerId);
        const menuItemObjectIds = await validateMenuItem(menuItems);

        // Generate a unique ID for the new order
        const newOrderId = await getUniqueOrderId();

        // Create and save the new order
        const newOrder = await new Order({
            id: newOrderId,
            customerId: customerObjectId,
            restaurantId: restaurantObjectId,
            menuItems: menuItemObjectIds,
            status: 'ordered',
            pickupTime: pickupTime ? new Date(pickupTime) : null,
        }).save();

        // Update the customer with the new order reference
        await Customer.findOneAndUpdate(
          {_id: customerObjectId},
          {$push: {orders: newOrder._id}}, // Push the new order's MongoDB _id to the customer's orders array
          {new: true}
        );

        return newOrder;
    } catch (error) {
        throw new Error("Error creating order: " + error.message);
    }
};


export const getAllOrders = async () => {
    try {
        const orders = await Order.find({}).populate('customerId').populate('restaurantId').populate('menuItems');
        return orders;
    } catch (error) {
        throw new Error("Error fetching orders: " + error.message);
    }
};


export const getOrderById = async (orderId) => {
    try {
        const order = await Order.findOne({id: orderId}).populate('customerId').populate('restaurantId').populate('menuItems');
        if (!order) {
            throw new Error("Order not found.");
        }
        return order;
    } catch (error) {
        throw new Error("Error fetching order: " + error.message);
    }
};


export const updateOrderStatus = async (orderId, newStatus) => {
    try {
        const updatedOrder = await Order.findOneAndUpdate(
          {id: orderId},
          {status: newStatus},
          {new: true}
        );

        if (!updatedOrder) {
            throw new Error("Order not found");
        }

        return updatedOrder;
    } catch (error) {
        throw new Error("Error updating order status: " + error.message);
    }
};


export const deleteOrder = async (orderId) => {
    try {
        const deletedOrder = await Order.findOneAndDelete({id: orderId});
        if (!deletedOrder) {
            throw new Error("Order not found");
        }

        // After successfully deleting the order, remove its reference from the customer's orders array
        await Customer.findOneAndUpdate(
          {_id: deletedOrder.customerId},
          {$pull: {orders: deletedOrder._id}}, // Remove the order's _id from the customer's orders array
          {new: true}
        );

        return deletedOrder;
    } catch (error) {
        throw new Error("Error deleting order: " + error.message);
    }
};

export const deleteAllOrders = async () => {
    try {
        await getAllOrders().then(async orders => {
            for (const order of orders) {
                await deleteOrder(order.id);
            }
        })
    } catch (error) {
        throw new Error("Error deleting orders: " + error.message);
    }

}

// TODO: fetchOrdersByCustomer

// TODO: fetchOrdersByRestaurant

// TODO: schedulePickup


// ----------------------- Helper functions -----------------------

// Function to find the latest order id and increment it by one for a new unique order id
const getUniqueOrderId = async () => {
    const latestOrder = await Order.findOne().sort('-id').exec(); // Find the highest id
    return latestOrder ? latestOrder.id + 1 : 1; // Start from 1 if no orders exist
};

// Function to check if an order exists
const orderExists = async (orderId) => {
    const order = await Order.findOne({id: orderId});
    return order ? true : false;
}

// Function to validate an order
export const validateOrder = async (orderId) => {
    const order = await Order.findOne({id: orderId});
    if (!order) throw Error("Order does not exist");
    return order._id;
}
