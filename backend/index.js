// Code adapted from https://github.com/mrchenliang/learning-node
import express from "express";
import connectDB from './database/database.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRouter from "./routes/user.route.js";
import menuItemRouter from "./routes/menuItem.route.js";
import restaurantRouter from "./routes/restaurant.route.js";

// dotenv is for when we want to use environment variables (for deploying)
//import dotenv from 'dotenv';
//dotenv.config();

const app = express();
app.use(cors());
const port = 8080; //process.env.PORT || 8080;

const url = await connectDB();

// allows app to deal with url encoded and json requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Welcome message
app.get("/", (request, response) => {
    response.send("Welcome to the Restaurant Ordering and Pickup Management System!");
});

// set to use the applicable router
app.use('/users', userRouter);
app.use('/menuItems', menuItemRouter);
app.use('/restaurants', restaurantRouter);

// Not found
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
});
  
// Error
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, function () {
  console.log(`🚀 Fire app listening on port ${port}, connected to ${url}!`);
});
  