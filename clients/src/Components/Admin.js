import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { URL } from "../url";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifDetails, setNotifDetails] = useState("");
  const [userCount, setUserCount] = useState({ users: 0, admins: 0 });
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/");
    } else {
      showNotifications();
      getUserCount();
      fetchUsers();
    }
  }, [user, navigate]);

  const showNotifications = async () => {
    try {
      const res = await axios.get(`${URL}/admin/notifications`, {
        withCredentials: true,
      });
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      throw err;
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
      setNotifTitle("");
      setNotifDetails("");
    } catch (err) {
      console.error("Error posting notification:", err);
    }
  };

  const handleNotificationDelete = async (id) => {
    try {
      await axios.delete(`${URL}/admin/notifications/${id}`, {
        withCredentials: true,
      });
      showNotifications();
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const getUserCount = async () => {
    try {
      const res = await axios.get(`${URL}/admin/user-counts`, {
        withCredentials: true,
      });
      setUserCount({ users: res.data.userCount, admins: res.data.adminCount });
    } catch (err) {
      console.error("Error fetching user count:", err);
      throw err;
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${URL}/admin/users`, {
        withCredentials: true,
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
      throw err;
    }
  };

  const handlePromoteUser = async (userId) => {
    try {
      await axios.put(
        `${URL}/auth/promote/${userId}`,
        {},
        { withCredentials: true }
      );
      fetchUsers();
      getUserCount();
    } catch (err) {
      console.error("Error promoting user:", err);
    }
  };

  const handleDemoteUser = async (userId) => {
    try {
      await axios.put(
        `${URL}/auth/demote/${userId}`,
        {},
        { withCredentials: true }
      );
      fetchUsers();
      getUserCount();
    } catch (err) {
      console.error("Error demoting user:", err);
    }
  };
  console.log("hi");
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h3>User Statistics</h3>
      <p>Regular Users: {userCount.users}</p>
      <p>Admins: {userCount.admins}</p>

      <h3>Post new Notification</h3>
      <input
        type="text"
        placeholder="Notification Title"
        value={notifTitle}
        onChange={(e) => setNotifTitle(e.target.value)}
      />
      <textarea
        placeholder="Notification Details"
        value={notifDetails}
        onChange={(e) => setNotifDetails(e.target.value)}
      />
      <button onClick={handlePostNotification}>Post Notification</button>

      <h3>Current Notifications</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification._id}>
              <strong>{notification.title}</strong> - {notification.details}
              <button
                onClick={() => handleNotificationDelete(notification._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <h3>User Management</h3>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.name} ({user.email}) - Role: {user.role}
            {user.role === "user" ? (
              <button onClick={() => handlePromoteUser(user._id)}>
                Promote to Admin
              </button>
            ) : (
              <button onClick={() => handleDemoteUser(user._id)}>
                Demote to User
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
