import mongoose from "mongoose";

mongoose.set('strictQuery', true);

// NOTE: Make the database on port 27017, and call it "315-final"
// User collection called "users" 

const connectDB = async () => {
  // keeping env comment for later when we have to deploy
  const url = 'mongodb://localhost:27017/315-final'; //process.env.MONGO_URI || 'mongodb://localhost:27017/courses';
  try {
    const connection = await mongoose.connect(url, {
      useUnifiedTopology: true,
    });
  } catch (e) {
    console.log("Failed to connect to courses database: ", e);
  }
  return url;
};

export default connectDB;