// src/components/Home.js
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { UserContext } from "../UserContext";
import { URL } from "../url";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  useEffect(() => {
    showNotifications();
    getUserCount();
  }, []);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifDetails, setNotifDetails] = useState("");
  const [userCount, setUserCount] = useState("N/A");
  const showNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${URL}/notifications`, {
        withCredentials: true,
      });
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      setNotifications([]); // Ensure notifications is an empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handlePostNotification = async () => {
    try {
      const res = await axios.post(
        `${URL}/notifications`,
        { title: notifTitle, details: notifDetails },
        { withCredentials: true }
      );
      console.log("Notification posted:", res);
      showNotifications();
    } catch (err) {
      console.log(err);
    }
  };
  const handleViewUsers = () => {
    navigate("/viewUsers");
  };

  const handleNotificationDelete = async (id) => {
    try {
      const res = await axios.delete(`${URL}/notifications/${id}`, {
        withCredentials: true,
      });
      showNotifications();
      console.log("Notification deleted:", res);
    } catch (err) {
      console.log(err);
    }
  };

  const getUserCount = async () => {
    try {
      const res = await axios.get(`${URL}/users`, {
        withCredentials: true,
      });
      setUserCount(res.data);
      console.log("Number of users:", res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const { user, handleLogout } = useContext(UserContext);
  const [, , removeCookie] = useCookies(["uid"]);
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to the Admin Page</h1>
      <h3>Number of registered users: {userCount}</h3>
      <h3>Post new Notifications</h3>
      {/* <p>You are logged in as {user.email}</p> */}
      <input
        type="text"
        placeholder="Notification Title"
        value={notifTitle}
        onChange={(e) => setNotifTitle(e.target.value)}
      />
      <br></br>
      <textarea
        type="text"
        placeholder="Notification Details"
        value={notifDetails}
        onChange={(e) => setNotifDetails(e.target.value)}
      />
      <br></br>
      <button onClick={handlePostNotification}>Post Notification</button>
      <button onClick={handleViewUsers}>View User Details</button>

      <h3>Currently posted notifications</h3>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ul>
            {Array.isArray(notifications) &&
              notifications.map((notification) => (
                <li key={notification._id}>
                  <strong>{notification.title}</strong> - {notification.details}
                  , {notification.createdAt}
                  <a
                    className="delete"
                    data-id={notification._id}
                    onClick={() => handleNotificationDelete(notification._id)}
                  >
                    <img src="/trashcan.svg" alt="delete icon" />
                  </a>
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Admin;
