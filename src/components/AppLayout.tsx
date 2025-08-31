import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, CssBaseline, ListItemButton, Avatar, Typography, Divider, Button, CircularProgress } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import type { RootState } from '../app/store';

const drawerWidth = 220;


const getMenuItems = (role: string | undefined) => {
  if (role === 'admin') {
    return [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
      { text: 'Cursos', icon: <ClassIcon />, path: '/admin/courses' },
      { text: 'Usuarios', icon: <PeopleIcon />, path: '/admin/users' },
    ];
  } else if (role === 'alumno') {
    return [
      { text: 'Mis Cursos', icon: <ClassIcon />, path: '/student/courses' },
      { text: 'Mi Perfil', icon: <PeopleIcon />, path: '/student/profile' },
    ];
  }
  return [];
};




const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [loggingOut, setLoggingOut] = useState(false);
  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      dispatch(logout());
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
      setLoggingOut(false);
    }, 700);
  };

  const menuItems = getMenuItems(user?.role);
  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#f5f6fa' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', py: 3, bgcolor: '#1976d2', color: 'white' }}>
        <Avatar sx={{ width: 56, height: 56, mb: 1, bgcolor: '#fff' }}>
          {user?.name ? user.name[0].toUpperCase() : 'U'}
        </Avatar>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
          {user?.name || 'Usuario'}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>
          {user?.role === 'admin' ? 'Administrador' : user?.role === 'alumno' ? 'Alumno' : 'Invitado'}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton selected={location.pathname.startsWith(item.path)} onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Button variant="outlined" color="error" onClick={handleLogout} fullWidth>
          Cerrar sesión
        </Button>
      </Box>
    </Box>
  );

  if (loggingOut) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CssBaseline />
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              bgcolor: '#f5f6fa',
              borderRight: '1px solid #e0e0e0',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
        <Box flexGrow={1} display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Box>
            <Typography variant="h6" mb={2}>Cerrando sesión...</Typography>
            <Box display="flex" justifyContent="center"><CircularProgress size={60} /></Box>
          </Box>
        </Box>
      </Box>
    );
  }
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#f5f6fa',
            borderRight: '1px solid #e0e0e0',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 1, sm: 3 }, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
