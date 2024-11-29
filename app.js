require("dotenv").config();

const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("We are live");
});

app.listen(process.env.PORT, () => {
  console.log(
    "Server is running on port: http://localhost:" + process.env.PORT
  );
});
