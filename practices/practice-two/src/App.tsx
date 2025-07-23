import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

// constants
import { ROUTE } from "@/constants/userRoutes";

// components
import { ProtectedRoute, Toast, AuthRedirect } from "@/components";

// pages
import {
	AccountSettingPage,
	BookPreviewPage,
	FavouritePage,
	HomePage,
	MyShelfPage,
	NotFoundPage,
	SearchPage,
	SignInPage,
	SignUpPage,
} from "@/pages";

// services
import { queryClient } from "@/services";

// layouts
import MainLayout from "@/layouts/MainLayout";

const App: React.FC = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<Toast />
			<Router>
				<Routes>
					<Route path="/" element={<AuthRedirect />} />
					<Route path={ROUTE.LOGIN} element={<SignInPage />} />
					<Route path={ROUTE.REGISTER} element={<SignUpPage />} />
					<Route element={<MainLayout />}>
						<Route
							path={ROUTE.HOME}
							element={
								<ProtectedRoute>
									<HomePage />
								</ProtectedRoute>
							}
						/>
						<Route
							path={ROUTE.FAVOURITE}
							element={
								<ProtectedRoute>
									<FavouritePage />
								</ProtectedRoute>
							}
						/>
						<Route
							path={ROUTE.ACCOUNT_SETTING}
							element={
								<ProtectedRoute>
									<AccountSettingPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path={ROUTE.SEARCH}
							element={
								<ProtectedRoute>
									<SearchPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path={ROUTE.BOOK_PREVIEW_BY_ID}
							element={
								<ProtectedRoute>
									<BookPreviewPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path={ROUTE.MY_SHELF}
							element={
								<ProtectedRoute>
									<MyShelfPage />
								</ProtectedRoute>
							}
						/>
					</Route>
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</Router>
		</QueryClientProvider>
	);
};

export default App;
