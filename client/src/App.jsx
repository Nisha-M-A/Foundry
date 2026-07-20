import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Protected routes — Stage 3 will replace the placeholder */}
        <Route element={<PrivateRoute />}>
          <Route
            path="/dashboard"
            element={
              <main className="min-h-screen bg-gray-950 flex items-center justify-center">
                <p className="text-white text-xl">Dashboard coming in Stage 3</p>
              </main>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;

