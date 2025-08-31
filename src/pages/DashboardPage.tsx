
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';


const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
      if (!token) {
        navigate('/login');
      } else if (user?.role === 'alumno') {
        navigate('/student/courses', { replace: true });
      }
    }, [token, user, navigate]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <Box>
      <Typography variant="h4" mb={2}>Bienvenido, {user.name || 'Usuario'}!</Typography>
      <Typography variant="subtitle1" mb={4}>Rol: {user.role}</Typography>
      <Divider sx={{ mb: 4 }} />
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Gestión de Usuarios</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Accede a la gestión de usuarios desde el menú lateral o aquí.</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Gestión de Cursos</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Accede a la gestión de cursos desde el menú lateral o aquí.</Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default DashboardPage;
