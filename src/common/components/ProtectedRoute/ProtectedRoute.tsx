import React from 'react';
import Login from '../../../pages/Login/Login';

interface ProtectedRouteProps {
  children: JSX.Element;
}

function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element | null {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  return token && refreshToken ? children : <Login />;
}

export default ProtectedRoute;
