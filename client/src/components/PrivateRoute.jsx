import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { token, loading } = useAuth();

  // Wait for localStorage re-hydration before deciding to redirect
  // (prevents flash-redirect to /login on refresh when user is actually logged in)
  if (loading) return null;

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
