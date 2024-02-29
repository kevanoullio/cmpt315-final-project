import mongoose, { Types } from "mongoose";

// Define the schema for the restaurant model
const restaurantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        location: {
            type: String,
            required: [true, "Location is required"],
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
            type: Types.ObjectId,
            ref: "MenuItem"
        }]
    },
    {
        timestamps: true
    }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
