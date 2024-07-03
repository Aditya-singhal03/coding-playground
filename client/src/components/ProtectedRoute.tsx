import { useAuth } from "../provider/auth";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  console.log(user);

  if (loading) {
    // Render a loading spinner or placeholder
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/auth" />;
}

export default ProtectedRoute;
