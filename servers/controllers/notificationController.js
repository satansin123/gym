const Notifications = require("../models/notificationModel");

async function displayNotifications(req, res) {
  try {
    const notifications = await Notifications.find()
      .sort({ createdAt: -1 })
      .limit(20); // Limit to last 20 notifications for performance

    if (notifications.length === 0) {
      return res.status(204).json({ message: "No notifications found" });
    }

    res.json(notifications);
  } catch (error) {
    console.error("Error getting notifications:", error);
    res.status(500).json({ error: "Failed to retrieve notifications" });
  }
}

module.exports = { displayNotifications };
