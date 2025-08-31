import React, { useEffect } from 'react';
import { Box, Typography, Button, Stack, Dialog, Paper, Divider, CircularProgress } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyCourses } from '../features/courses/myCoursesSlice';
import type { RootState, AppDispatch } from '../app/store';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Nombre', width: 200 },
  { field: 'description', headerName: 'Descripción', width: 250 },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 150,
    renderCell: (params) => (
      <Button size="small" variant="outlined" onClick={() => params.row.handleViewDetails(params.row)}>
        Ver Detalle
      </Button>
    ),
  },
];




const StudentCoursesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { myCourses, loading, error } = useSelector((state: RootState) => state.myCourses);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [detailCourse, setDetailCourse] = React.useState<any | null>(null);

  useEffect(() => {
    dispatch(fetchMyCourses());
  }, [dispatch]);

  const handleViewDetails = (course: any) => {
    setDetailCourse(course);
    setOpenDetail(true);
  };
  const handleCloseDetail = () => setOpenDetail(false);

  const rowsWithHandlers = myCourses.map((row) => ({
    ...row,
    handleViewDetails,
  }));

  return (
    <Box mt={5} ml={5} mr={5}>
      <Typography variant="h4" mb={2}>Mis Cursos</Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper sx={{ p: 3, bgcolor: '#fff7f7', mb: 2 }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      ) : (
        <DataGrid
          rows={rowsWithHandlers}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5, page: 0 },
            },
          }}
          pageSizeOptions={[10, 20]}
          disableRowSelectionOnClick
          autoHeight
        />
      )}

      {/* Modal de detalle */}
      <Dialog open={openDetail} onClose={handleCloseDetail} maxWidth="xs" fullWidth>
        <Paper sx={{ p: 3, bgcolor: '#f7f7fa' }}>
          <Typography variant="h6" mb={2} align="center" color="primary">
            Detalle del Curso
          </Typography>
          {detailCourse && (
            <>
              <Typography variant="subtitle2" color="text.secondary">Nombre</Typography>
              <Typography variant="body1" mb={1}>{detailCourse.name}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" color="text.secondary">Descripción</Typography>
              <Typography variant="body1" mb={1}>{detailCourse.description}</Typography>
            </>
          )}
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
            <Button onClick={handleCloseDetail} variant="contained" color="primary">Cerrar</Button>
          </Stack>
        </Paper>
      </Dialog>
    </Box>
  );
};

export default StudentCoursesPage;
