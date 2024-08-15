// src/components/Home.js
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { UserContext } from "../UserContext";

import { useNavigate } from "react-router-dom";

const Notifications = () => {
  useEffect(() => {
    showNotifications();
  }, []);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      title: "No Notications",
      details: "There are no notifications posted for now",
    },
  ]);
  const showNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/notifications", {
        withCredentials: true,
      });
      console.log(res.data);
      if (res.data.length != 0) {
        setNotifications(res.data);
      } else {
        setNotifications([
          {
            title: "No Notications",
            details: "There are no notifications posted for now",
          },
        ]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

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
  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        await axios.post(
          "http://localhost:8000/deleteUser",
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
    console.log("hey");
  };

  return (
    <div>
      <h1>Welcome to the Notifications Page</h1>
      <p>You are logged in as {user.email}</p>
      <p>Current Notifications:</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ul>
            {notifications.map((notification) => (
              <li>
                <strong>{notification.title}</strong> <br></br>{" "}
                {notification.details}, sent at- {notification.createdAt}
              </li>
            ))}
          </ul>
        </>
      )}
      <button onClick={handleLogout}>Sign Out</button>
      <button onClick={handleDeleteAccount}>Delete Account</button>
      <button onClick={handleWorkout}>Workouts</button>
      <button onClick={handleJoinClan}>Join Clan</button>
      <button onClick={handleViewClan}>View Clans</button>
      <button onClick={handleCreateClan}>Create Clan</button>
    </div>
  );
};

export default Notifications;
