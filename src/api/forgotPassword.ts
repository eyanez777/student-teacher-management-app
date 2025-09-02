import api from '../api/axios';


export const forgotPassword = async (data: any) => {
  // Busca el usuario por email (debería existir un endpoint GET /users?email=...)
  const userResp = await api.post(`/auth/forgot-password`, data);
  const user = Array.isArray(userResp.data) ? userResp.data[0] : userResp.data;
  return user;
};

export const resetPassword = async (data: { token: string; newPassword: string }) => {
  
  const response = await api.post(`/auth/reset-password`, data);
  return response.data.response;
};
