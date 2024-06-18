const Clan = require("../models/clanModel");
const ClanUser = require("../models/clanUserModel");

async function createClan(req, res) {
  try {
    const { name } = req.body;
    const userId = req.user.id; // Assuming authenticated user

    const existingClan = await Clan.findOne({ name });
    if (existingClan) {
      return res.status(400).json({ error: "Clan name already in use" });
    }

    const clan = new Clan({
      name,
      members: [userId],
      clanLeader: userId,
    });

    await clan.save();

    // Update ClanUser document for the user
    await ClanUser.findOneAndUpdate(
      { uid: userId },
      { $addToSet: { clanIds: clan._id.toString(), clanNames: clan.name } },
      { upsert: true }
    );

    res.status(201).json(clan);
  } catch (error) {
    console.error("Error creating clan:", error);
    res.status(500).json({ error: "Server error" });
  }
}

async function joinClan(req, res) {
  try {
    const { clanName } = req.body;
    const userId = req.user.id; // Assuming authenticated user

    const clan = await Clan.findOneAndUpdate(
      { name: clanName },
      { $addToSet: { members: userId } },
      { new: true }
    );

    if (!clan) {
      return res.status(404).json({ error: "Clan not found" });
    }

    // Update ClanUser document for the user
    await ClanUser.findOneAndUpdate(
      { uid: userId },
      { $addToSet: { clanIds: clan._id.toString(), clanNames: clan.name } },
      { upsert: true }
    );

    res.json(clan);
  } catch (error) {
    console.error("Error joining clan:", error);
    res.status(500).json({ error: "Server error" });
  }
}

async function viewAllClans(req, res) {
  try {
    const clans = await Clan.find({})
      .populate("clanLeader", "name")
      .populate("members", "name");

    res.json(clans);
  } catch (error) {
    console.error("Error fetching all clans:", error);
    res.status(500).json({ error: "Server error" });
  }
}

async function viewUserClans(req, res) {
  try {
    const userId = req.user.id; // Assuming authenticated user

    const clanUser = await ClanUser.findOne({ uid: userId });
    if (!clanUser) {
      return res.status(404).json({ error: "User has not joined any clans" });
    }

    const clanIds = clanUser.clanIds;

    const clans = await Clan.find({ _id: { $in: clanIds } })
      .populate("clanLeader", "name")
      .populate("members", "name");

    res.json(clans);
  } catch (error) {
    console.error("Error fetching user clans:", error);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = { createClan, joinClan, viewAllClans, viewUserClans };
