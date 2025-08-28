
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import type { RootState } from '../app/store';
import { isTokenExpired } from '../utils/token-utils';


import type { ReactNode } from 'react';
interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state: RootState) => state.auth);

  // Validar expiración del token antes de renderizar la ruta protegida
  const [checking, setChecking] = React.useState(true);
  useEffect(() => {
    if (!token) {
      setChecking(false);
      return;
    }
    if (isTokenExpired(token)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch({ type: 'auth/logout' });
      navigate('/login', { replace: true });
    } else {
      setChecking(false);
    }
  }, [token, navigate, dispatch]);

  if (!token || checking) {
    // Mientras se valida el token o si no hay token, no renderizar nada
    return null;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
