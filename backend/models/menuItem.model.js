import mongoose, { Types } from "mongoose";

// Define the schema for the menu item model
const menuItemSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: [true, "Menu item ID is required"],
            unique: true,
        },
        name: {
            type: String,
            required: [true, "Name is required"],
        }, 
        status: {
            type: String,
            required: [true, "Status is required"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
        },
        restaurant: [{
            type: Types.ObjectId,
            ref: "Restaurant",
            required: false
        }]
    },
    {
        timestamps: true
    }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

export default MenuItem;
