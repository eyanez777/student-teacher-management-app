import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { login } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../app/store';
import type { AppDispatch } from '../app/store';

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, token, user } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Hidratar auth desde localStorage al cargar la app
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser && !token && !user) {
      // Despachar acción para setear el estado de auth
      dispatch({
        type: 'auth/login/fulfilled',
        payload: {
          access_token: storedToken,
          user: JSON.parse(storedUser),
        },
      });
    }
  }, [dispatch, token, user]);
  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <Box maxWidth={400} mx="auto" mt={10} p={3} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" mb={2}>Iniciar Sesión</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Ingresar'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default LoginPage;
