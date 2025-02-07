import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// constants
import { ROUTE } from '@/constants/userRoutes';

// components
import LoginPage from '@/pages/SignIn';
import RegisterPage from '@/pages/SignUp';
import Home from '@/pages/Home';
import Favourite from '@/pages/Favourite';
import Profile from '@/pages/Profile';
import { MenuSidebar, Header } from '@/components';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path={ROUTE.LOGIN} element={<LoginPage />} />
        <Route path={ROUTE.REGISTER} element={<RegisterPage />} />
        <Route
          path="*"
          element={
            <div className="flex min-h-screen bg-gradient-to-r from-[#FA7C54] to-[#EC2C5A] p-2 sm:p-4">
              <div className="flex w-full min-h-screen bg-[#F5F5F5] rounded-lg shadow-md overflow-hidden">
                <MenuSidebar />
                <div className="flex flex-col flex-1">
                  <Header />
                  <main className="flex-grow p-4 sm:p-6 md:p-10">
                    <Routes>
                      <Route path={ROUTE.HOME} element={<Home />} />
                      <Route path={ROUTE.FAVOURITE} element={<Favourite />} />
                      <Route path={ROUTE.PROFILE} element={<Profile />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
