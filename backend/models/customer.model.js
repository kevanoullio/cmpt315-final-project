import mongoose, { Types } from "mongoose";

// Define the schema for the customer model
const customerSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: [true, "Customer ID is required"],
            unique: true,
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            unique: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
        },
        address: {
            type: String,
            required: [true, "Address is required"],
        },
        orders: [{
            type: Types.ObjectId,
            ref: "Order",
            required: false
        }]
    },
    {
        timestamps: true
    }
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;

