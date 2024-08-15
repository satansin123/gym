const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

async function postNotifications(req, res) {
  try {
    const notification = new Notification({
      title: req.body.title,
      details: req.body.details,
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error("Error posting notification:", error);
    res.status(500).json({ error: "Server error" });
  }
}

async function getUserCount(req, res) {
  try {
    const userCount = await User.find().count();

    res.status(201).json(userCount);
  } catch (error) {
    console.error("Error getting number of users:", error);
    res.status(500).json({ error: "Server error" });
  }
}

async function deleteNotification(req, res) {
  try {
    const id = req.params.id;
    await Notification.findByIdAndDelete(id);
    res.status(201).json({ data: "successfully deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = { postNotifications, getUserCount, deleteNotification };
