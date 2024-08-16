import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "./url";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const PUBLIC_ROUTES = ["/login", "/signup", "/admin", "/viewusers"];

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get(`${URL}/auth/verify-token`, {
          withCredentials: true,
        });
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token verification failed:", error.response?.data);
        setUser(null);
        setIsAuthenticated(false);
        if (!PUBLIC_ROUTES.includes(window.location.pathname)) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, [navigate]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      setUser(response.data.user);
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${URL}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <UserContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
