const Notifications = require("../models/notificationModel");
// const ClanUser = require("../models/clanUserModel");

async function displayNotifications(req, res) {
  try{
    const notification = await Notifications.find().sort({createdAt: -1})

    res.json(notification)
  } catch(error) {
    console.error("Error getting notifications:", error);
    res.status(500).json({ error: "Server error" });
  }
}


module.exports = { displayNotifications};
