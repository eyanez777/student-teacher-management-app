import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import type { RootState, AppDispatch } from './store';
import { isTokenExpired } from '../utils/token-utils';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = useSelector((state: RootState) => state.auth);

  // Hidratar auth desde localStorage al cargar la app
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser && !token && !user) {
      if (isTokenExpired(storedToken)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (location.pathname !== '/login') {
          navigate('/login', { replace: true });
        }
        return;
      }
      dispatch({
        type: 'auth/login/fulfilled',
        payload: {
          access_token: storedToken,
          user: JSON.parse(storedUser),
        },
      });
    }
  }, [dispatch, token, user, navigate, location.pathname]);

//   // Validar expiración del token en cada render
//   useEffect(() => {
//     if (token && isTokenExpired(token)) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       dispatch({ type: 'auth/logout' });
//       if (location.pathname !== '/login') {
//         navigate('/login', { replace: true });
//       }
//     }
//   }, [token, navigate, location.pathname, dispatch]);

  // Redirección global según autenticación y rol
  useEffect(() => {
    if (!token) {
      if (location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
    } else if (isTokenExpired(token)) {
      if (location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
    } else if (user) {
      if (location.pathname === '/login') {
        if (user.role === 'admin' || user.role === 'alumno') {
          navigate('/dashboard', { replace: true });
        }
      }
    }
  }, [token, user, location, navigate]);

  return <>{children}</>;
};

export default AuthProvider;
