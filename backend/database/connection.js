const mongoose = require("mongoose");
const DB = "mongodb+srv://huzaifa:Huzaifa0786@carselling.retqihx.mongodb.net/?retryWrites=true&w=majority&appName=carselling";

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
