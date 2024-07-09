const Car = require("../models/car");

const createCar = async (req, res) => {
  console.log("outside try")
  try {
    console.log("into try")
    const { model, price, phone } = req.body;
    const picturePaths = req.files.map((file) => `/uploads/${file.filename}`);

    const newCar = new Car({
      model,
      price,
      phone,
      pictures: picturePaths,
    });
    console.log("before saving in try")
    await newCar.save();
    res.status(201).json(newCar);
  } catch (error) {
    console.error("Error creating car entry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createCar,
};
