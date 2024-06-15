const express = require("express");
const router = express.Router();
const {
  createWorkout,
  getWorkouts,
} = require("../controllers/workoutController");

router.post("/", createWorkout);
router.get("/", getWorkouts);

module.exports = router;
