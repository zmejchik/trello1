import { useNavigate } from 'react-router-dom';

export const useLogOut = (): { logOut: () => void } => {
  const navigate = useNavigate();

  const logOut = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return { logOut };
};
