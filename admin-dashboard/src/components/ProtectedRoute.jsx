import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminContext } from "../context/AdminContext.jsx";

export default function ProtectedRoute({ children }) {
  const { adminUser } = useAdminContext();
  const location = useLocation();

  if (!adminUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

