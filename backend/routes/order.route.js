import express from 'express';
import { createOrder, fetchAllOrders, updateOrderStatus, deleteOrder, fetchOrderById } from '../controllers/order.controller.js'

const orderRouter = express.Router();

// route for getting all orders
orderRouter.get('/', fetchAllOrders);

// route for fetching an order by its ID
orderRouter.get('/:orderId', fetchOrderById);

// route for creating a new order
orderRouter.post('/', createOrder);

// Route for updating an order's status
orderRouter.patch('/:orderId', updateOrderStatus);

// Route for deleting an order
orderRouter.delete('/:orderId', deleteOrder);

// Export the router
export default orderRouter;
