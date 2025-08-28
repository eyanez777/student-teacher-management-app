import { jwtDecode } from 'jwt-decode';

export function isTokenExpired(token: string): boolean {
  try {
    const rest = jwtDecode(token);
    console.log('Token decodificado:', rest);
    const decoded: { exp: number } = jwtDecode(token);

    // exp está en segundos desde epoch
    const now = Date.now() / 1000;
    console.log('Tiempo actual (segundos desde epoch):', now);
    if(decoded.exp < now){
      alert('El token ha expirado');
      console.log('El token ha expirado');
    }
    return decoded.exp < now;
  } catch (e) {
    console.error('Error al decodificar el token:', e);
    return true; // Si no se puede decodificar, lo consideramos expirado
  }
}