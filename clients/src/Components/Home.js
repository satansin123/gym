// src/components/Home.js
import React, { useContext } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { UserContext } from "../UserContext";
import { URL } from "../url";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user, handleLogout } = useContext(UserContext);
  const [, , removeCookie] = useCookies(["uid"]);
  const navigate = useNavigate();
  const handleWorkout = async () => {
    navigate("/workouts");
  };
  const handleJoinClan = async () => {
    navigate("/joinclan");
  };
  const handleCreateClan = async () => {
    navigate("/createClan");
  };
  const handleViewClan = async () => {
    navigate("/viewClans");
  };
  const handleViewAllClan = async () => {
    navigate("/viewAllClans");
  };
  const handleCalorieTracker = async () => {
    navigate("/add-calorie");
  };

  const handleNotifications = async () => {
    navigate("/notifications");
  };
  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        await axios.post(
          `${URL}/deleteUser`,
          {},
          { withCredentials: true }
        );

        removeCookie("uid");
        handleLogout();
        navigate("/login");
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>You are logged in as {user.email}</p>
      <button onClick={handleLogout}>Sign Out</button>
      <button onClick={handleDeleteAccount}>Delete Account</button>
      <button onClick={handleWorkout}>Workouts</button>
      <button onClick={handleJoinClan}>Join Clan</button>
      <button onClick={handleViewClan}>View Your Clans</button>
      <button onClick={handleViewAllClan}>View All Clans</button>
      <button onClick={handleCreateClan}>Create Clan</button>
      <button onClick={handleCalorieTracker}>Add calorie</button>
      <button onClick={handleNotifications}>Notifications</button>
    </div>
  );
};

export default Home;
