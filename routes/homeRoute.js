const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("home"); // Ensure the view exists
});

module.exports = router;
