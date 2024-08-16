const express = require("express");
const router = express.Router();
const {
  handleSignUp,
  handleLogin,
  handleSignOut,
  deleteUser,
  verifyToken,
  fetchAllUsers,
} = require("../controllers/userControllers");

router.post("/signup", handleSignUp);
router.post("/login", handleLogin);
router.post("/logout", handleSignOut);
router.post("/deleteUser", deleteUser);
router.get("/verify-token", verifyToken);
router.post("/fetchAllUsers", fetchAllUsers);

module.exports = router;
