import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from './tokenService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    getAccessToken().then(token => {
      if (!token) {
        navigate('/login', { replace: true });
      }
    });
  }, [navigate]);

  return <>{children}</>;
};

export default ProtectedRoute;
