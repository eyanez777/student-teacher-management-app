import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import SchoolIcon from '@mui/icons-material/School';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  role: string | undefined;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const navigate = useNavigate();
  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/dashboard')}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        {role === 'admin' && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/admin/users')}>
                <ListItemIcon><PeopleIcon /></ListItemIcon>
                <ListItemText primary="Usuarios" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/admin/courses')}>
                <ListItemIcon><ClassIcon /></ListItemIcon>
                <ListItemText primary="Cursos" />
              </ListItemButton>
            </ListItem>
          </>
        )}
        {role === 'alumno' && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/student/courses')}>
              <ListItemIcon><SchoolIcon /></ListItemIcon>
              <ListItemText primary="Mis Cursos" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
