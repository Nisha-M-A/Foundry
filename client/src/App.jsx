import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import BlueprintPage from './pages/BlueprintPage';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Dedicated blueprint viewer pages */}
            <Route path="/projects/:projectId/blueprint/:blueprintType" element={<BlueprintPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;



