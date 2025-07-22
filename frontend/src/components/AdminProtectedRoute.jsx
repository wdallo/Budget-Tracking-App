import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Adjust the check below based on your user object structure
  if (user && user.role === "admin") {
    return children;
  }

  // Redirect non-admins
  return <Navigate to="/access-denied" />;
};

export default AdminProtectedRoute;
