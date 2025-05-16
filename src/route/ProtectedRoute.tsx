import { useAuth } from '@/contexts/AuthContext';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isLogged } = useAuth();

  if (!isLogged) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
