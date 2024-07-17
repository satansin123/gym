const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CalorieSchema = new Schema({
  itemName: {
    type: String,
    required: true
  },
  itemQuantity: {
    type: Number,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'others'],
    required: true
  }
});

module.exports = mongoose.model('Calorie', CalorieSchema);
