import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from '@/pages/SignIn';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<LoginPage />} />
        {/* Define Login Page route */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
