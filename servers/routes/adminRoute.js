const express = require("express");
const router = express.Router();
const { postNotifications, getUserCount, deleteNotification } = require("../controllers/adminController");

router.post("/notifications", postNotifications);
router.delete("/notifications/:id", deleteNotification);
router.get("/users", getUserCount);

module.exports = router;
