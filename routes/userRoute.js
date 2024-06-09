const express = require("express");
const router = express.Router();
const { handleSignUp, handleLogin } = require("../controllers/userControllers");

// Route to render the signup page
router.get("/signup", (req, res) => {
  return res.render("signup");
});

// Route to handle signup form submission
router.post("/signup", handleSignUp);

// Route to render the login page
router.get("/login", (req, res) => {
  return res.render("login");
});

// Route to handle login form submission
router.post("/login", handleLogin);

module.exports = router;
