const express = require("express");
const router = express.Router();
const {
  postNotifications,
  getUserCount,
  deleteNotification,
  promoteToAdmin,
  demoteToUser,
  fetchAllUsers,
  getNotifications,
} = require("../controllers/adminController");
const { isAdmin } = require("../middlewares/auth");
router.post("/notifications", isAdmin, postNotifications);
router.delete("/notifications/:id", isAdmin, deleteNotification);
router.get("/user-counts", isAdmin, getUserCount);
router.put("/promote/:id", isAdmin, promoteToAdmin);
router.put("/demote/:id", isAdmin, demoteToUser);
router.get("/users", isAdmin, fetchAllUsers);
router.get("/notifications", isAdmin, getNotifications);

module.exports = router;
