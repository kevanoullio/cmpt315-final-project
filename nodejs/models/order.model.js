import mongoose, { Types } from "mongoose";

// Define the schema for the order model
const orderSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: [true, "Order ID is required"],
            unique: true,
        },
        date: {
            type: Date,
            required: [true, "Date is required"],
        },
        time_of_day: {
            type: String,
            required: [true, "Time of day is required"],
        },
        restaurant: {
            type: Types.ObjectId,
            ref: "Restaurant",
            required: [true, "Restaurant is required"]
        },
        menuItems: [{
            type: Types.ObjectId,
            ref: "MenuItem",
            required: [true, "Menu items are required"]
        }],
        user: {
            type: Types.ObjectId,
            ref: "User",
            required: [true, "User is required"]
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
