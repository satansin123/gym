import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode"; // Fixed the import

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["uid"]);

  const checkCookie = async () => {
    const token = cookies.uid;
    console.log("Checking token from cookies:", token); // Debugging statement
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded); // Debugging statement
        setUser(decoded);
        setIsAuthenticated(true); // Set authentication status to true
      } catch (error) {
        console.error("Error decoding token:", error);
        removeCookie("uid", { path: "/" });
        setIsAuthenticated(false); // Set authentication status to false
        navigate("/login");
      }
    } else {
      setIsAuthenticated(false); // Set authentication status to false
      navigate("/login");
    }
  };

  useEffect(() => {
    checkCookie().then(() => {
      setLoading(false); // Set loading to false when checkCookie completes
    });
  }, []);

  const checkLocalStorage = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true); // Set authentication status to true
    }
  };

  useEffect(() => {
    checkLocalStorage();
  }, []);

  const handleLogout = () => {
    removeCookie("uid");
    setUser(null);
    setIsAuthenticated(false); // Set authentication status to false
    localStorage.removeItem("user");
    navigate("/login");
  };
  if (loading) {
    return <div>Loading...</div>; // Render a loading indicator while checking the cookie
  }
  return (
    <UserContext.Provider
      value={{ user, isAuthenticated, setUser, handleLogout }}
    >
      {children}
    </UserContext.Provider>
  );
};
