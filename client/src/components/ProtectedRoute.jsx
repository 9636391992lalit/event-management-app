import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Role-based restriction
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;