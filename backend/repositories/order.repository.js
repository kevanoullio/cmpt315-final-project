import Order from '../models/order.model.js';
import MenuItem from '../models/menuItem.model.js';
import Restaurant from '../models/restaurant.model.js';
import Customer from '../models/customer.model.js';

export const createOrder = async ({ customerId, restaurantId, menuItems, pickupTime }) => {
    try {
        // input validation
        const restaurantObjectId = await validateRestaurant(restaurantId);
        const customerObjectId = await validateCustomer(customerId);
        const menuItemObjectIds = await validateAndDeductMenuItemInventory(menuItems);

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
            { _id: customerObjectId },
            { $push: { orders: newOrder._id } }, // Push the new order's MongoDB _id to the customer's orders array
            { new: true }
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
        const order = await Order.findOne({ id: orderId }).populate('customerId').populate('restaurantId').populate('menuItems');
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
            { id: orderId },
            { status: newStatus },
            { new: true }
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
        const deletedOrder = await Order.findOneAndDelete({ id: orderId });

        if (!deletedOrder) {
            throw new Error("Order not found");
        }

        // After successfully deleting the order, remove its reference from the customer's orders array
        await Customer.findOneAndUpdate(
            { _id: deletedOrder.customer._id },
            { $pull: { orders: deletedOrder._id } }, // Remove the order's _id from the customer's orders array
            { new: true }
        );

        return deletedOrder;
    } catch (error) {
        throw new Error("Error deleting order: " + error.message);
    }
};

// TODO: fetchOrdersByCustomer

// TODO: fetchOrdersByRestaurant

// TODO: schedulePickup


// ----------------------- Helper functions -----------------------

// Function to find the latest order id and increment it by one for a new unique order id
const getUniqueOrderId = async () => {
    const latestOrder = await Order.findOne().sort('-id').exec(); // Find the highest id
    return latestOrder ? latestOrder.id + 1 : 1; // Start from 1 if no orders exist
};


async function validateRestaurant(restaurantId) {
    const restaurant = await Restaurant.findOne({ id: restaurantId });
    if (!restaurant) throw new Error("Invalid Restaurant");
    return restaurant._id;
}


async function validateCustomer(customerId) {
    const customer = await Customer.findOne({ id: customerId });
    if (!customer) throw new Error("Invalid Customer");
    return customer._id;
}


// Validates menu items existence and inventory, then decrements inventory for each item ordered.
async function validateAndDeductMenuItemInventory(menuItems) {
    const itemsToOrder = await MenuItem.find({ 'id': { $in: menuItems } });
    
    // Verify all requested items are found and have sufficient inventory
    if (itemsToOrder.length !== menuItems.length) {
        throw new Error("One or more menu items are not found.");
    }
    if (itemsToOrder.some(item => item.inventory <= 0)) {
        throw new Error("One or more menu items are out of stock.");
    }

    // Deduct inventory for each item ordered
    await Promise.all(itemsToOrder.map(item => {
        if (item.inventory > 0) item.inventory -= 1;
        return item.save();
    }));

    return itemsToOrder.map(item => item._id);
}