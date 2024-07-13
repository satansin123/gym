const express = require("express");
const router = express.Router();
const {
  joinClan,
  createClan,
  viewClans,
  clanChats,
  sendMessage
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

router.post("/clanChat", clanChats)

router.post("/sendMessage", sendMessage)


module.exports = router;
