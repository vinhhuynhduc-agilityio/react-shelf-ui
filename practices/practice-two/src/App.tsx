import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// constants
import { ROUTE } from '@/constants/userRoutes';

// components
import LoginPage from '@/pages/SignIn';
import RegisterPage from '@/pages/SignUp';
import Home from '@/pages/HomePage';
import { MenuSidebar, Header } from '@/components';
import { FavouritePage, ProfilePage, SearchPage } from '@/pages';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path={ROUTE.LOGIN} element={<LoginPage />} />
          <Route path={ROUTE.REGISTER} element={<RegisterPage />} />
          <Route
            path="*"
            element={
              <div className="flex min-h-screen bg-gradient-to-r from-[#FA7C54] to-[#EC2C5A] p-6">
                <div className="flex w-full min-h-screen bg-[#F5F5F5] rounded-lg shadow-md overflow-hidden">
                  <MenuSidebar />
                  <div className="flex flex-col flex-1 w-full overflow-hidden">
                    <Header />
                    <main className="flex-grow p-4">
                      <Routes>
                        <Route
                          path={ROUTE.HOME}
                          element={
                            <ProtectedRoute>
                              <Home />
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
                          path={ROUTE.PROFILE}
                          element={
                            <ProtectedRoute>
                              <ProfilePage />
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
