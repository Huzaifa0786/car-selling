const express = require("express");
const app = express();
const router = express.Router();
const multer = require("multer");
require("../database/connection");
const Authenticate = require("../middleware/authenticate");

// Multer setup for file uploads
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Login route
const login = require("../controllers/user");
router.post("/login", login);

// Add car route
const { createCar } = require("../controllers/car");
router.post("/addcar", Authenticate, upload.array("pictures", 10), createCar);

module.exports = router;
