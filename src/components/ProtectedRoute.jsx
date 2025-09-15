import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const role = user?.role;

  // If not logged in or no token, redirect to login
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // If role is not authorized, redirect to home
  if (roles && !roles.includes(role)) {
    return <Navigate to="/home" replace />;
  }

  // Logged in and authorized, show the page
  return children;
};

export default ProtectedRoute;
