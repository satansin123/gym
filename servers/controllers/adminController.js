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
    const userCount = await User.countDocuments(); // Changed for consistency and correctness
    res.status(200).json({ userCount }); // Changed status code to 200 for successful GET request
  } catch (error) {
    console.error("Error getting number of users:", error);
    res.status(500).json({ error: "Server error" });
  }
}

async function deleteNotification(req, res) {
  try {
    const id = req.params.id;
    const deletedNotification = await Notification.findByIdAndDelete(id);
    if (!deletedNotification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = { postNotifications, getUserCount, deleteNotification };
