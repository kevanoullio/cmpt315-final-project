import mongoose, { Types } from "mongoose";

// Define the schema for the manager model
const managerSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: [true, "Manager ID is required"],
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
        restaurantId: {
            type: Types.ObjectId,
            ref: "Restaurant",
            required: [true, "Restaurant ID is required"]
        }
    },
    {
        timestamps: true
    }
);

const Manager = mongoose.model("Manager", managerSchema);

export default Manager;
