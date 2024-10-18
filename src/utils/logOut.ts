import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export const useLogOut = (): { logOut: () => void } => {
  const navigate = useNavigate();

  const logOut = (): void => {
    localStorage.removeItem('token');
    Cookies.remove('refreshToken');
    navigate('/login');
  };

  return { logOut };
};
