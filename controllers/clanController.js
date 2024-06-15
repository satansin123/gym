const express = require("express");
const Clan = require("../models/clanModel"); // Ensure the correct path
const User = require("../models/userModel"); // Ensure the correct path

async function createClan(req, res) {
  try {
    const { clanName } = req.body;

    const user = req.user;

    const userId = user.id;
    const clanAlready = await Clan.findOne({ name: clanName });

    if (clanAlready) {
      return res.status(400).send("Clan name in use");
    }

    const clan = Clan({
      name: clanName,
      members: [userId],
      clanLeader: userId,
    });
    clan.save();
    res.send(`${clanName} was created!`);
    console.log(req.body);
  } catch (error) {
    console.error(error.message);
  }
}

async function joinClan(req, res) {
  try {
    const { clanName } = req.body;

    if (!clanName) {
      return res.status(400).send("Missing clanName");
    }

    const user = req.user;

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
}

module.exports = { createClan, joinClan };
