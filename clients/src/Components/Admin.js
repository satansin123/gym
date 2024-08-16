import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { UserContext } from "../UserContext";
import { URL } from "../url";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifDetails, setNotifDetails] = useState("");
  const [userCount, setUserCount] = useState("N/A");

  const navigate = useNavigate();
  const { user, handleLogout } = useContext(UserContext);
  const [, , removeCookie] = useCookies(["uid"]);

  useEffect(() => {
    showNotifications();
    getUserCount();
  }, []);

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
      await axios.post(
        `${URL}/admin/notifications`,
        { title: notifTitle, details: notifDetails },
        { withCredentials: true }
      );
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
      await axios.delete(`${URL}/admin/notifications/${id}`, {
        withCredentials: true,
      });
      showNotifications();
    } catch (err) {
      console.log(err);
    }
  };

  const getUserCount = async () => {
    try {
      const res = await axios.get(`${URL}/admin/getUsers`, {
        withCredentials: true,
      });
      setUserCount(res.data.userCount); // Updated to match the response format
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Welcome to the Admin Page</h1>
      <h3>Number of registered users: {userCount}</h3>
      <h3>Post new Notifications</h3>
      <input
        type="text"
        placeholder="Notification Title"
        value={notifTitle}
        onChange={(e) => setNotifTitle(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Notification Details"
        value={notifDetails}
        onChange={(e) => setNotifDetails(e.target.value)}
      />
      <br />
      <button onClick={handlePostNotification}>Post Notification</button>
      <button onClick={handleViewUsers}>View User Details</button>

      <h3>Currently posted notifications</h3>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification._id}>
              <strong>{notification.title}</strong> - {notification.details},{" "}
              {new Date(notification.createdAt).toLocaleString()}{" "}
              {/* Added date formatting */}
              <a
                className="delete"
                onClick={() => handleNotificationDelete(notification._id)}
                style={{ cursor: "pointer", marginLeft: "10px" }}
              >
                <img src="/trashcan.svg" alt="delete icon" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Admin;
