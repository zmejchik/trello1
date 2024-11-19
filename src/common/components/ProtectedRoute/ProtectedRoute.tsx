import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element | null {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !refreshToken) {
      navigate('/login');
    }
  }, [navigate, token, refreshToken]);

  return token && refreshToken ? children : null;
}

export default ProtectedRoute;
