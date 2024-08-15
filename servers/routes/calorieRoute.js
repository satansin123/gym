const express = require("express");
const router = express.Router();
const {
  calorieEntry,
  getCalorie,
  updateCalorie,
  deleteCalorie,
} = require("../controllers/calorieController");

router.post("/add-calorie", calorieEntry);
router.get("/view-calories", getCalorie);
router.patch("/calories/:id", updateCalorie); // Corrected path
router.delete("/calories/:id", deleteCalorie); // Corrected path

module.exports = router;
