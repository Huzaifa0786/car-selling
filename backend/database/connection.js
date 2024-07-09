const mongoose = require("mongoose");
// const DB = "mongodb://localhost:27017/carselling";
require("dotenv").config();
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Successfully connected to MongoDB!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

connectToDatabase();
module.exports = connectToDatabase;
