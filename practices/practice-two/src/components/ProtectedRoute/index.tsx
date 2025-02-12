import { Navigate } from "react-router-dom";

// hooks
import { useCurrentUser } from "@/hooks/useCurrentUser";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentUser = useCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
