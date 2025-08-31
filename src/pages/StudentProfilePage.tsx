import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { Box, Typography, Paper, Avatar, Divider } from '@mui/material';

const StudentProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) return null;

  return (
    <Box mt={5} ml={5} mr={5} display="flex" justifyContent="center">
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }} elevation={3}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Avatar sx={{ width: 64, height: 64, mb: 1, bgcolor: '#1976d2', color: 'white', fontSize: 32 }}>
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </Avatar>
          <Typography variant="h6">{user.name}</Typography>
          <Typography variant="body2" color="text.secondary">{user.email}</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom>Información de perfil</Typography>
        <Typography variant="body2"><b>Nombre:</b> {user.name}</Typography>
        <Typography variant="body2"><b>Email:</b> {user.email}</Typography>
        <Typography variant="body2"><b>Rol:</b> Alumno</Typography>
      </Paper>
    </Box>
  );
};

export default StudentProfilePage;
