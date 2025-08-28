
import React, { useEffect } from 'react';
import { Box, Typography, Button, Stack, CircularProgress, Alert } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../features/users/usersSlice';
import type { RootState, AppDispatch } from '../app/store';
// Columnas de ejemplo, ajusta según tu modelo
const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Nombre', width: 180 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'role', headerName: 'Rol', width: 120 },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 380,
    renderCell: (params) => (
      <Stack direction="row" spacing={3} margin={1}>
        <Button size="small" variant="outlined">Editar</Button>
        <Button size="small" color="error" variant="outlined">Eliminar</Button>
        <Button size="small" variant="contained">Asociar Cursos</Button>
      </Stack>
    ),
  },
];

// Datos de ejemplo, reemplaza por fetch real


const AdminUsersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <Box mt={5} ml={5} mr={5}>
      <Typography variant="h4" mb={2}>Gestión de Usuarios (Admin)</Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }}>Crear Usuario</Button>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <DataGrid
          rows={users}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5, page: 0 },
            },
          }}
          
          disableRowSelectionOnClick
        />
      )}
      {/* Modales y formularios para crear/editar/asociar usuarios aquí */}
    </Box>
  );
};

export default AdminUsersPage;
