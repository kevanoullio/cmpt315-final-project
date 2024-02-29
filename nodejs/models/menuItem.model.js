import mongoose, { Types } from "mongoose";

// Define the schema for the menu item model
const menuItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
        },
        restaurant: {
            type: Types.ObjectId,
            ref: "Restaurant"
        }
    },
    {
        timestamps: true
    }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

export default MenuItem;
