import { jwtDecode } from 'jwt-decode';

const isTokenExpired = (token: string): boolean => {
  if (!token) return true;
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (!decodedToken.exp) {
      return true;
    }

    return decodedToken.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export default isTokenExpired;
