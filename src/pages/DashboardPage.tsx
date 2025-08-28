
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';


const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, token } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!token) {
        navigate('/login');
        }
    }, [token, navigate]);

  return (
    <Box display="flex">
      <Sidebar role={user?.role} />
      <Box flex={1} ml={30} p={4}>
        <Typography variant="h4" mb={2}>Bienvenido, {user?.name || 'Usuario'}!</Typography>
        <Typography variant="subtitle1" mb={4}>Rol: {user?.role}</Typography>
        <Divider sx={{ mb: 4 }} />
        {user?.role === 'admin' && (
          <>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Gestión de Usuarios</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Accede a la gestión de usuarios desde la barra lateral o aquí.</Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Gestión de Cursos</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Accede a la gestión de cursos desde la barra lateral o aquí.</Typography>
              </AccordionDetails>
            </Accordion>
          </>
        )}
        {user?.role === 'alumno' && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Mis Cursos</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Accede a tu listado de cursos desde la barra lateral o aquí.</Typography>
            </AccordionDetails>
          </Accordion>
        )}
      </Box>
    </Box>
  );
};

export default DashboardPage;
