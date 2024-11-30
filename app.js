require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

const { register, login } = require("./src/controllers/authController");

app.use(express.json());

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB database");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.get("/", (req, res) => {
  res.send("We are live");
});

app.post("/register", register);
app.post("/login", login);

app.listen(process.env.PORT, () => {
  console.log(
    "Server is running on port: http://localhost:" + process.env.PORT
  );
});
