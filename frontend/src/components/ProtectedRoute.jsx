import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading, isAuthed } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-medium text-[#2f3e2c]">Loading...</div>
      </div>
    );
  }

  if (!isAuthed || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If the user is logged in but doesn't have the right role, 
    // maybe redirect to their profile or home page
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}
