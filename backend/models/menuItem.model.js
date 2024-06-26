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
    status: {
      type: String,
      required: [true, "Status is required"] // sold out or in stock
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    image: {
      type: String,
      // required: [true, "Image is required"],
    },
  },
  {
    timestamps: true
  }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

export default MenuItem;
