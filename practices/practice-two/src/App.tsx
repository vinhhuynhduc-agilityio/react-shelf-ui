import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// constants
import { ROUTE } from '@/constants/userRoutes';

// components
import LoginPage from '@/pages/SignIn';
import RegisterPage from '@/pages/SignUp';
import BookShelfHome from '@/pages/BookShelfHome';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<LoginPage />} />
        {/* Define Login Page route */}
        <Route path={ROUTE.LOGIN} element={<LoginPage />} />
        <Route path={ROUTE.REGISTER} element={<RegisterPage />} />
        <Route path="/home" element={<BookShelfHome />} />
      </Routes>
    </Router>
  );
};

export default App;
