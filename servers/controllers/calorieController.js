const Calorie = require("../models/CalorieModel");

// Enter a calorie item
async function calorieEntry(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const newCalorie = new Calorie(req.body);
    const savedCalorie = await newCalorie.save();
    res.status(201).json(savedCalorie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Get all calorie items
async function getCalorie(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const calories = await Calorie.find();
    res.json(calories);
  } catch (err) {
    console.error("Error fetching calories:", err.message);
    res.status(500).json({ message: err.message });
  }
}

// Update a calorie item
async function updateCalorie(req, res) {
  try {
    const updatedCalorie = await Calorie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedCalorie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Delete a calorie item
async function deleteCalorie(req, res) {
  try {
    await Calorie.findByIdAndDelete(req.params.id);
    res.json({ message: "Calorie entry deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  calorieEntry,
  getCalorie,
  updateCalorie,
  deleteCalorie,
};