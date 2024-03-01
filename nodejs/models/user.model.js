import mongoose, { Types } from "mongoose";

// Define the schema for the user model
const userSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: [true, "User ID is required"],
            unique: true,
        },
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
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

const User = mongoose.model("User", userSchema);

export default User;
