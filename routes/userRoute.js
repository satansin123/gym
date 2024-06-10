const express = require("express");
const router = express.Router();
const {
  handleSignUp,
  handleLogin,
  handleSignOut,
  deleteUser,
} = require("../controllers/userControllers");

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signup", handleSignUp);

router.get("/login", (req, res) => {
  return res.render("login");
});

router.post("/login", handleLogin);

router.get("/logout", handleSignOut);

router.post("/deleteUser", deleteUser);

module.exports = router;
