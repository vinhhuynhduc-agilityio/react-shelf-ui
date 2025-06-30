import { Navigate } from "react-router-dom";

// hooks
import { useCurrentUser } from "@/hooks";

// constants
import { ROUTE } from "@/constants";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const currentUser = useCurrentUser();

	if (!currentUser) {
		return <Navigate to={ROUTE.LOGIN} replace />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
