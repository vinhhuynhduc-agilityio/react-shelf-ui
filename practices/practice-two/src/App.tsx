import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// constants
import { ROUTE } from "@/constants/userRoutes";

// components
import { MenuSidebar, Header, ProtectedRoute } from "@/components";

// pages
import {
	AccountSettingPage,
	BookPreviewPage,
	FavouritePage,
	HomePage,
	MyShelfPage,
	SearchPage,
	SignInPage,
	SignUpPage,
} from "@/pages";

const App: React.FC = () => {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<Routes>
					<Route path="/" element={<SignInPage />} />
					<Route path={ROUTE.LOGIN} element={<SignInPage />} />
					<Route path={ROUTE.REGISTER} element={<SignUpPage />} />
					<Route
						path="*"
						element={
							<div className="flex min-h-screen bg-gradient-to-r from-[#FA7C54] to-[#EC2C5A] p-6">
								<div className="flex w-full min-h-screen bg-[#F5F5F5] rounded-lg shadow-md overflow-hidden">
									<MenuSidebar />
									<div className="flex flex-col flex-1 w-full overflow-hidden">
										<Header />
										<main className="flex-grow p-6">
											<Routes>
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
											</Routes>
										</main>
									</div>
								</div>
							</div>
						}
					/>
				</Routes>
			</Router>
		</QueryClientProvider>
	);
};

export default App;
