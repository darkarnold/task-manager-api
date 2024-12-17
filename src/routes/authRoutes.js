const express = require("express");
const {
  initiatePasswordReset,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/forgot-password", initiatePasswordReset);

router.patch("/reset-password/:token", resetPassword);

module.exports = router;
