const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
const path = require("path");
const corsOptions = {
  origin: ["https://car-selling-test.vercel.app"],
  methods: ["POST", "GET"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(require("./router/auth"));
app.get("/", (req, res) => {
  res.send("welcome to home page from Server");
});

app.listen(5000, () => {
  console.log("Running on port 5000");
});
