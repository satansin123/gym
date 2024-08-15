import React, { useState, useEffect } from "react";
import axios from "axios";

const CalorieTracker = () => {
  const [calories, setCalories] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(0);
  const [caloriesValue, setCaloriesValue] = useState(0);
  const [mealType, setMealType] = useState("breakfast");

  useEffect(() => {
    fetchCalories();
  }, []);

  const fetchCalories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/view-calories");
      setCalories(res.data);
    } catch (error) {
      console.error("Error fetching calories:", error);
    }
  };

  const addCalorie = async () => {
    const newCalorie = {
      itemName,
      itemQuantity,
      calories: caloriesValue,
      mealType,
    };
    try {
      await axios.post("http://localhost:8000/add-calorie", newCalorie);
      fetchCalories();
    } catch (error) {
      console.error("Error adding calorie:", error);
    }
  };

  const deleteCalorie = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/calories/${id}`);
      fetchCalories();
    } catch (error) {
      console.error("Error deleting calorie:", error);
    }
  };

  const updateCalorie = async (id) => {
    const updatedCalorie = {
      itemName,
      itemQuantity,
      calories: caloriesValue,
      mealType,
    };
    try {
      await axios.patch(`http://localhost:8000/calories/${id}`, updatedCalorie);
      fetchCalories();
    } catch (error) {
      console.error("Error updating calorie:", error);
    }
  };

  return (
    <div>
      <h1>Calorie Tracker</h1>
      <input
        type="text"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        placeholder="Item Name"
      />
      <input
        type="number"
        value={itemQuantity}
        onChange={(e) => setItemQuantity(e.target.value)}
        placeholder="Item Quantity"
      />
      <input
        type="number"
        value={caloriesValue}
        onChange={(e) => setCaloriesValue(e.target.value)}
        placeholder="Calories"
      />
      <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
        <option value="breakfast">Breakfast</option>
        <option value="lunch">Lunch</option>
        <option value="dinner">Dinner</option>
        <option value="others">Others</option>
      </select>
      <button onClick={addCalorie}>Add Calorie</button>

      <ul>
        {calories.map((calorie) => (
          <li key={calorie._id}>
            {calorie.itemName} - {calorie.itemQuantity} - {calorie.calories} -{" "}
            {calorie.mealType}
            <button onClick={() => deleteCalorie(calorie._id)}>Delete</button>
            <button onClick={() => updateCalorie(calorie._id)}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalorieTracker;