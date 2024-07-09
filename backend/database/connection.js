const mongoose = require("mongoose");
const DB = "mongodb://localhost:27017/carselling";

async function connectToDatabase() {
  try {
    await mongoose.connect(DB);
    console.log("Successfully connected to MongoDB!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

connectToDatabase();
module.exports = connectToDatabase;
