// userRoute.js - User authentication routes
const express = require("express");
const router = express.Router();
const {
  handleSignUp,
  handleLogin,
  handleSignOut,
  deleteUser,
} = require("../controllers/userControllers");

router.post("/signup", handleSignUp);
router.post("/login", handleLogin);
router.get("/logout", handleSignOut);
router.post("/deleteUser", deleteUser);

module.exports = router;
