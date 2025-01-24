import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// components
import LoginPage from '@/pages/SignIn';
import RegisterPage from '@/pages/SignUp';

// constants
import { ROUTE } from '@/constants/urls';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<LoginPage />} />
        {/* Define Login Page route */}
        <Route path={ROUTE.LOGIN} element={<LoginPage />} />
        <Route path={ROUTE.REGISTER} element={<RegisterPage />} />
      </Routes>
    </Router>
  );
};

export default App;
