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
        }],
        storeHours: {
          open: { type: String, required: false },
          close: { type: String, required: false },
        }
        //might wanna include string time validation later: https://stackoverflow.com/a/77139480
        /*
        ex. postman patch to add hours:
        {
          "storeHours": {
              "open": "7:30",
              "close": "20:30"
          }
        }
        */
    },
    {
        timestamps: true
    }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
