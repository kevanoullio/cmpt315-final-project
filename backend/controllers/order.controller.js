import { createOrder as createOrderRepo, getAllOrders, updateOrderStatus as updateOrderStatusRepo} from '../repositories/order.repository.js';
import { deleteOrder as deleteOrderRepo, getOrderById } from '../repositories/order.repository.js';


// creating a new order
export const createOrder = async (req, res) => {
    try {
        const { restaurantId, menuItems, customerId, pickupTime } = req.body;
        const newOrder = await createOrderRepo({ restaurantId, menuItems, customerId, pickupTime });
        res.status(201).json(newOrder);
    } catch (error) {
        // Determine the type of error and respond accordingly
        if (error.message.includes("Invalid Restaurant") || error.message.includes("not available")) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};


export const fetchAllOrders = async (req, res) => {
    try {
        const orders = await getAllOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const fetchOrderById = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await getOrderById(orderId);
        res.json(order);
    } catch (error) {
        // Determine the type of error and respond accordingly
        if (error.message.includes("not found")) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};


export const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const { orderId } = req.params;

    try {
        const updatedOrder = await updateOrderStatusRepo(orderId, status);
        res.json(updatedOrder);
    } catch (error) {
        // Determine the type of error and respond accordingly
        if (error.message.includes("not found")) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};


export const deleteOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        const deletedOrder = await deleteOrderRepo(orderId);

        res.json({ message: "Order successfully deleted", orderId: deletedOrder.id });
    } catch (error) {
        // Determine the type of error and respond accordingly
        if (error.message.includes("not found")) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};