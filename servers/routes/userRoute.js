
// userRoute.js - User authentication routes
const express = require("express");
const router = express.Router();
const {
  handleSignUp,
  handleLogin,
  handleSignOut,
  deleteUser,
  fetchAllUsers,
} = require("../controllers/userControllers");

router.post("/signup", handleSignUp);
router.post("/login", handleLogin);
router.get("/logout", handleSignOut);
router.post("/deleteUser", deleteUser);
router.post("/fetchAllUsers", fetchAllUsers);



module.exports = router;
