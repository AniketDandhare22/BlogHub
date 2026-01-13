import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import HomeSkeleton from "../component/HomeSkeleton";

const ProtectedRoute = ({ children }) => {
  const { isAuth, loading } = useAuth();
  if (loading) {
    return <HomeSkeleton />;
  }
  if (!isAuth) return <Navigate to="/auth" />;

  return children;
};

export default ProtectedRoute;
