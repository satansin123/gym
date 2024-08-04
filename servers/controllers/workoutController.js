const Workout = require("../models/workoutDataModel");

const mongoose = require("mongoose");

async function createWorkout(req, res) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const { exercises } = req.body;
  const newWorkout = new Workout({
    user: userId, // Use the instantiated ObjectId
    exercises,
    date: new Date(), // Add the current date to the workout document
  });

  try {
    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getWorkouts(req, res) {
  try {
    const userId = req.user.id;
    const workouts = await Workout.find({ user: userId }).sort({ date: -1 });
    const workoutsByDate = {};
    workouts.forEach((workout) => {
      const date = workout.date.toISOString().split("T")[0];
      if (!workoutsByDate[date]) {
        workoutsByDate[date] = [];
      }
      workoutsByDate[date].push(workout);
    });
    const workoutsArray = Object.values(workoutsByDate);
    res.status(200).json(workoutsArray);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getWorkouts,
  createWorkout,
};
