import mongoose, { Types } from "mongoose";

// Define the schema for the user model
const userSchema = new mongoose.Schema(
    {
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
            ref: "Order"
        }]
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;
