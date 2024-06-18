const express = require("express");
const Clan = require("../models/clanModel"); // Ensure the correct path
const User = require("../models/userModel"); // Ensure the correct path
const ClanName = require("../models/clanUserModel"); // Ensure the correct path
const ClanUser = require("../models/clanUserModel");

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

    const clanId = clan._id;

    if (!clan) {
      console.log("No such clan");
      return res.status(404).send("Clan not found");
    }

    const clanUser = await ClanUser.findOneAndUpdate(
      { uid: userId }, // Query to find the user
      {
        $addToSet: { clanNames: clanName, clanIds: clanId }, // $addToSet ensures no duplicates
      },
      { upsert: true, new: true, setDefaultsOnInsert: true } // upsert creates a new document for if user hasnt joined any clans
    );

    console.log("Updated clan:", clan);
    res.send("User ID added to clan");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server error");
  }
}

async function viewClans(req, res) {
  try {
    const user = req.user;

    const userId = user.id;

    const clans = await ClanName.findOne({ uid: userId });

    if (!clans) {
      console.log("user hasnt linked their id with clans");
      return res.status(404).send("error for being a bitch");
    }

    console.log(clans.clanNames);
    res.json(clans.clanNames);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { createClan, joinClan, viewClans };
