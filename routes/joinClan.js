const express = require("express");
const router = express.Router();
const Clan = require("../models/clanModel"); // Ensure the correct path
const User = require("../models/userModel"); // Ensure the correct path
const { getUser } = require("../services/userServiceToken");

router.post("/", async (req, res) => {
  try {
    const { clanName } = req.body;

    if (!clanName) {
      return res.status(400).send("Missing clanName or userId in request body");
    }

    const token = req.cookies?.uid;
    if (!token) {
      console.log("No token found, redirecting to login");
      return res.redirect("/login");
    }

    const user = getUser(token);
    if (!user) {
      console.log("Token verification failed, redirecting to login");
      return res.redirect("/login");
    }

    const userId = user.id;

    const steps = user.steps;

    // Find the clan by name and update the members array
    const clan = await Clan.findOneAndUpdate(
      { name: clanName },
      {
        $addToSet: { members: userId }, // $addToSet ensures no duplicates
        //$inc: { steps: steps } // Increment the steps field by the value of steps
      },
      { new: true, upsert: false } // Ensure upsert is false to avoid creating new documents
    );

    if (!clan) {
      console.log("No such clan");
      return res.status(404).send("Clan not found");
    }

    // const user = await User.findOneAndUpdate(
    //     {_id: userId},
    //     {$addToSet: {clans: clanName}}
    // );

    console.log("Updated clan:", clan);
    res.send("User ID added to clan");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
