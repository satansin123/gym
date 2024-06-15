const express = require("express");
const router = express.Router();
const {
  joinClan,
  createClan,
  viewClans
} = require("../controllers/clanController");

router.get("/joinClan", (req, res) => {
  return res.render("joinClan");
});

router.post("/joinClan", joinClan);

router.get("/createClan", (req, res) => {
  return res.render("createClan");
});

router.post("/createClan", createClan);

router.get("/viewClans", viewClans);

module.exports = router;
