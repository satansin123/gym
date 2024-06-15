import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(UserContext); // Use isAuthenticated state

  console.log("Is authenticated:", isAuthenticated); // Debugging statement

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
