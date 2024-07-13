const express = require("express");
const router = express.Router();
const Clan = require("../models/clanModel"); // Ensure the correct path
const { query } = require("express-validator");
const { setUser, getUser } = require("../services/userServiceToken");

router.post("/", [], async (req, res) => {
  try {
    const { clanName } = req.body;

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
});

//the express validator between (req,res) and '/
module.exports = router;
