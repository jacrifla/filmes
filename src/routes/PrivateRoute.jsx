import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function PrivateRoute() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    )
  }

  return token 
    ? <Outlet /> 
    : <Navigate to="/login" />;
}