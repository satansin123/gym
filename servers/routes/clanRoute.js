const express = require("express");
const router = express.Router();
const {
  joinClan,
  createClan,

  viewAllClans, viewUserClans
} = require("../controllers/clanController");

router.post("/createClan", createClan);
router.post("/joinClan", joinClan);
router.get("/viewClans/all", viewAllClans);
router.get("/viewClans/user", viewUserClans);

module.exports = router;
