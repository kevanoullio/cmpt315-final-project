import mongoose, { Types } from "mongoose";

// Schema for the order model
const orderSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: [true, "Order ID is required"],
            unique: true,
        },
        status: {
            type: String,
            required: [true, "Status is required"],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"]
        },
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: [true, "Restaurant is required"]
        },
        menuItems: [{
            type: Types.ObjectId,
            ref: "MenuItem",
            required: [true, "Menu items are required"]
        }],
        pickupTime: {
            type: Date,
            required: [false], // optional initially, can be updated later
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
