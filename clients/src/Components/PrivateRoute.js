import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(UserContext);

  console.log("Is authenticated:", isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
