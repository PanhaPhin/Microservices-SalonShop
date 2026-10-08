import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {

  const { auth } = useSelector((store: any) => store);

  const jwt = localStorage.getItem("jwt");

  if (!jwt) {
    return <Navigate to="/login" replace />;
  }

  // Wait for authentication restoration
  if (!auth.authInitialized) {
    return <div>Loading...</div>;
  }

  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(auth.user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;