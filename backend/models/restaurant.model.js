import mongoose, { Types } from "mongoose";

// Define the schema for the restaurant model
const restaurantSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: [true, "Restaurant ID is required"],
            unique: true,
        },
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        address: {
            type: String,
            required: [true, "Address is required"],
        },
        phone: {
            type: String,
            required: [true, "Phone is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
        },
        menuItems: [{
            type: Number,
            ref: "MenuItem",
            required: false
        }]
    },
    {
        timestamps: true
    }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
