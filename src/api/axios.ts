import axios from 'axios';
import { isTokenExpired } from '../utils/token-utils';


const instance = axios.create({
  baseURL: 'http://localhost:3000', // Cambia esto si tu API está en otra URL
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && !isTokenExpired(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    console.log('Respuesta de la API interceptor:', response);
    return response;
  },

  (error) => {
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      // Limpia el localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Opcional: muestra un mensaje de sesión expirada
      window.alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
      // Recarga la página para forzar el logout global
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
export default instance;
