import { Navigate } from "react-router-dom";

// constants
import { ROUTE } from "@/constants";

// stores
import { useUserStore } from "@/stores";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentUser } = useUserStore();

  if (!currentUser) {
    return <Navigate to={ROUTE.LOGIN} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
