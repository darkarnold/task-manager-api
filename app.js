require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

const userRoutes = require("./src/routes/userRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const authRoutes = require("./src/routes/authRoutes");

const authMiddleware = require("./src/middleware/authMiddleware");

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

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", authMiddleware.protect, taskRoutes);

app.listen(process.env.PORT, () => {
  console.log(
    "Server is running on port: http://localhost:" + process.env.PORT
  );
});
