
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';

// Columnas de ejemplo, ajusta según tu modelo
const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Nombre', width: 200 },
  { field: 'description', headerName: 'Descripción', width: 250 },
  {
    field: 'details',
    headerName: 'Detalle',
    width: 120,
    renderCell: (params) => (
      <Button size="small" variant="outlined">Ver Detalle</Button>
    ),
  },
];

// Datos de ejemplo, reemplaza por fetch real
const rows = [
  { id: 1, name: 'Matemáticas', description: 'Curso de matemáticas básicas' },
  { id: 2, name: 'Historia', description: 'Curso de historia universal' },
];

const StudentCoursesPage: React.FC = () => {
  return (
    <Box mt={5} ml={5} mr={5}>
      <Typography variant="h4" mb={2}>Mis Cursos (Alumno)</Typography>
      <DataGrid
        
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
        }}
        pageSizeOptions={[10,20]}
        disableRowSelectionOnClick
      />
      {/* Modal o sección para mostrar detalle del curso seleccionado */}
    </Box>
  );
};

export default StudentCoursesPage;
