import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import isTokenExpiried from '../../../utils/tokenExpiried';
import api from '../../../api/request';

interface ProtectedRouteProps {
  children: JSX.Element;
}

function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element | null {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const refreshToken = Cookies.get('refreshToken');

  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      if (!token || isTokenExpiried(token)) {
        if (refreshToken) {
          try {
            const response: { result: string; token: string; refreshToken: string } = await api.post('/refresh', {
              refreshToken,
            });
            localStorage.setItem('token', response.token);
            Cookies.set('refreshToken', response.refreshToken, { secure: true });
            window.location.reload();
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Authorization error',
              footer: error instanceof Error ? error.message : String(error),
            });
            localStorage.removeItem('token');
            Cookies.remove('refreshToken');
            navigate('/login');
          }
        } else {
          navigate('/login');
        }
      }
    };

    checkAuth();
  }, [navigate, token, refreshToken]);

  return token && !isTokenExpiried(token) ? children : null;
}

export default ProtectedRoute;
