import { Navigate } from "react-router-dom";

// constants
import { ROUTE } from "@/constants/userRoutes";

// pages
import { SignInPage } from "@/pages";

// stores
import { useUserStore } from "@/stores";

const AuthRedirect: React.FC = () => {
	const currentUser = useUserStore((state) => state.currentUser);
	return currentUser ? <Navigate to={ROUTE.HOME} replace /> : <SignInPage />;
};

export default AuthRedirect;
