const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  model: {
    type: String,
    required: [true, "Car model is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
  },
  pictures: {
    type: [String],
    required: [true, "At least one picture is required"],
  },
});

const Car = mongoose.model("Car", carSchema);
module.exports = Car;
