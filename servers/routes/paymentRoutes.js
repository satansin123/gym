const express = require("express");
const router = express.Router();
const {
  makePayment,
  handleVerifyPayment,
} = require("../controllers/paymentController");
router.post("/verify", handleVerifyPayment);
router.post("/orders", makePayment);
module.exports = router;
