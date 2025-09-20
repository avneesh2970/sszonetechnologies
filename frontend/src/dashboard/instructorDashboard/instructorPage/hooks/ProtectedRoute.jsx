// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import useAuth from "./useAuth";

const InstructorProtectedRoute = ({ children }) => {
  const { instructor, loading } = useAuth();

  if (loading) return <p className="flex justify-center items-center">Checking authentication...</p>;

  if (!instructor) return <Navigate to="/instructor/login" replace />;

  return children;
};

export default InstructorProtectedRoute;
              
