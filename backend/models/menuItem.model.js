import mongoose from "mongoose";

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
        inventory: { // The number of items in stock, replacing 'status'
            type: Number,
            required: [true, "Inventory is required"],
            min: [0, "Inventory cannot be negative"], // Ensures inventory is not negative
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
        }
    },
    {
        timestamps: true
    }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

export default MenuItem;
