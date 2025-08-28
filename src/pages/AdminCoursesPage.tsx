import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Dialog,
  TextField,
  Snackbar,
  Alert as MuiAlert,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses, createCourse, updateCourse, deleteCourse, updateCourseUsers } from "../features/courses/coursesSlice";
import { fetchUsers } from "../features/users/usersSlice";
import type { RootState, AppDispatch } from "../app/store";

const AdminCoursesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading, error } = useSelector((state: RootState) => state.courses);
  const { users } = useSelector((state: RootState) => state.users);
  // Estado para modal de asociación de usuarios
  const [openAssociate, setOpenAssociate] = useState(false);
  const [associateCourse, setAssociateCourse] = useState<any | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [associateError, setAssociateError] = useState<string | null>(null);
  const [associateSuccessSnackbar, setAssociateSuccessSnackbar] = useState(false);
  // Cargar usuarios al abrir modal de asociación
  useEffect(() => {
    if (openAssociate) {
      dispatch(fetchUsers());
    }
  }, [openAssociate, dispatch]);
  // Handlers asociación
  const handleOpenAssociate = (course: any) => {
    setAssociateCourse(course);
    setSelectedUserIds(course.users ? course.users.map((u: any) => u.id) : []);
    setAssociateError(null);
    setOpenAssociate(true);
  };
  const handleCloseAssociate = () => {
    setOpenAssociate(false);
    setAssociateCourse(null);
    setSelectedUserIds([]);
  };
  const handleToggleUser = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };
  const handleAssociate = async () => {
    if (!associateCourse) return;
    try {
      await dispatch(updateCourseUsers({ id: associateCourse.id, userIds: selectedUserIds })).unwrap();
      setOpenAssociate(false);
      setAssociateSuccessSnackbar(true);
    } catch (err: any) {
      setAssociateError(err || "Error al asociar usuarios");
    }
  };

  // Estado para modal de creación
  const [openCreate, setOpenCreate] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", description: "" });
  const [createError, setCreateError] = useState<string | null>(null);
  const [successSnackbar, setSuccessSnackbar] = useState(false);

  // Estado para edición
  const [openEdit, setOpenEdit] = useState(false);
  const [editCourse, setEditCourse] = useState<any | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccessSnackbar, setEditSuccessSnackbar] = useState(false);

  // Estado para modal de detalle
  const [openDetail, setOpenDetail] = useState(false);
  const [detailCourse, setDetailCourse] = useState<any | null>(null);

  // Estado para eliminar
  const [openDelete, setOpenDelete] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<any | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccessSnackbar, setDeleteSuccessSnackbar] = useState(false);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // Handlers creación
  const handleOpenCreate = () => {
    setNewCourse({ name: "", description: "" });
    setCreateError(null);
    setOpenCreate(true);
  };
  const handleCloseCreate = () => setOpenCreate(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };
  const handleCreate = async () => {
    if (!newCourse.name.trim()) {
      setCreateError("El nombre es obligatorio");
      return;
    }
    try {
      await dispatch(createCourse(newCourse)).unwrap();
      setOpenCreate(false);
      setSuccessSnackbar(true);
    } catch (err: any) {
      setCreateError(err || "Error al crear curso");
    }
  };

  // Handlers edición
  const handleOpenEdit = (course: any) => {
    setEditCourse({ ...course });
    setEditError(null);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => setOpenEdit(false);
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditCourse({ ...editCourse, [e.target.name]: e.target.value });
  };
  const handleEdit = async () => {
    if (!editCourse.name.trim()) {
      setEditError("El nombre es obligatorio");
      return;
    }
    try {
      await dispatch(updateCourse({ id: editCourse.id, data: { name: editCourse.name, description: editCourse.description } })).unwrap();
      setEditCourse(null);
      setOpenEdit(false);
      setEditSuccessSnackbar(true);
    } catch (err: any) {
      setEditError(err || "Error al editar curso");
    }
  };

  // Handlers detalle
  const handleViewDetails = (course: any) => {
    setDetailCourse(course);
    setOpenDetail(true);
  };
  const handleCloseDetail = () => {
    setOpenDetail(false);
    setDetailCourse(null);
  };

  // Handlers eliminar
  const handleOpenDelete = (course: any) => {
    setCourseToDelete(course);
    setDeleteError(null);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setCourseToDelete(null);
  };
  const handleDelete = async () => {
    if (!courseToDelete) return;
    try {
      await dispatch(deleteCourse(courseToDelete.id)).unwrap();
      setOpenDelete(false);
      setCourseToDelete(null);
      setDeleteSuccessSnackbar(true);
    } catch (err: any) {
      setDeleteError(err || "Error al eliminar curso");
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Nombre", width: 200 },
    { field: "description", headerName: "Descripción", width: 250 },
    {
      field: "users",
      headerName: "Usuarios",
      width: 120,
      renderCell: (params: any) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => handleViewDetails(params.row)}
        >
          Ver
        </Button>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 380,
      renderCell: (params: any) => (
        <Stack direction="row" spacing={3} margin={1}>
          <Button size="small" variant="outlined" onClick={() => handleOpenEdit(params.row)}>
            Editar
          </Button>
          <Button size="small" color="error" variant="outlined" onClick={() => handleOpenDelete(params.row)}>
            Eliminar
          </Button>
          <Button size="small" variant="contained" color="secondary" onClick={() => handleOpenAssociate(params.row)}>
            Asociar Usuarios
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box mt={5} ml={5} mr={5}>

      {/* Modal para asociar usuarios a curso */}
      <Dialog open={openAssociate} onClose={handleCloseAssociate} maxWidth="sm" fullWidth>
        <Paper sx={{ p: 3, bgcolor: '#f7f7fa' }}>
          <Typography variant="h6" mb={2} align="center" color="secondary">
            Asociar Usuarios al Curso
          </Typography>
          {associateCourse && (
            <>
              <Typography variant="subtitle2" color="text.secondary">Curso</Typography>
              <Typography variant="body1" mb={1}>{associateCourse.name}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" color="text.secondary">Selecciona los usuarios a asociar</Typography>
              <List dense sx={{ maxHeight: 250, overflow: 'auto', mb: 1 }}>
                {users.map((user: any) => (
                  <ListItem key={user.id} disablePadding>
                    <ListItemButton
                      selected={selectedUserIds.includes(user.id)}
                      onClick={() => handleToggleUser(user.id)}
                    >
                      <ListItemText
                        primary={user.name || user.email}
                        secondary={user.email}
                      />
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user.id)}
                        onChange={() => handleToggleUser(user.id)}
                        style={{ marginLeft: 8 }}
                        onClick={e => e.stopPropagation()}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              {associateError && <Alert severity="error">{associateError}</Alert>}
              <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
                <Button onClick={handleCloseAssociate}>Cancelar</Button>
                <Button variant="contained" color="secondary" onClick={handleAssociate} disabled={loading}>
                  Guardar
                </Button>
              </Stack>
            </>
          )}
        </Paper>
      </Dialog>

      {/* Snackbar de éxito asociación */}
      <Snackbar
        open={associateSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() => setAssociateSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert onClose={() => setAssociateSuccessSnackbar(false)} severity="success" sx={{ width: '100%' }} elevation={6} variant="filled">
          ¡Usuarios asociados correctamente!
        </MuiAlert>
      </Snackbar>
      <Typography variant="h4" mb={2}>
        Gestión de Cursos (Admin)
      </Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleOpenCreate}>
        Crear Curso
      </Button>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <DataGrid
          rows={courses}
          columns={columns}
          disableRowSelectionOnClick
          sx={{ sm:12,md: 6, lg:4 }}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5, page: 0 },
            },
          }}
          style={{ color: '#333', backgroundColor: '#f0f0f0' }}
        />
      )}

      {/* Modal de detalle de curso */}
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
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" color="text.secondary">Usuarios asociados</Typography>
              {detailCourse.users && Array.isArray(detailCourse.users) && detailCourse.users.length > 0 ? (
                <List dense>
                  {detailCourse.users.map((u: any) => (
                    <ListItem key={u.id} disablePadding>
                      <ListItemText primary={u.name || u.email || u.username || JSON.stringify(u)} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" fontStyle="italic">No hay usuarios asociados</Typography>
              )}
            </>
          )}
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
            <Button onClick={handleCloseDetail} variant="contained" color="primary">Cerrar</Button>
          </Stack>
        </Paper>
      </Dialog>

      {/* Modal para crear curso */}
      <Dialog open={openCreate} onClose={handleCloseCreate}>
        <Box p={3} minWidth={350}>
          <Typography variant="h6" mb={2}>Crear Curso</Typography>
          <Stack spacing={2}>
            <TextField
              label="Nombre"
              name="name"
              value={newCourse.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Descripción"
              name="description"
              value={newCourse.description}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={2}
            />
            {createError && <Alert severity="error">{createError}</Alert>}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={handleCloseCreate}>Cancelar</Button>
              <Button variant="contained" onClick={handleCreate} disabled={loading}>
                Guardar
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Dialog>

      {/* Modal para editar curso */}
      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <Box p={3} minWidth={350}>
          <Typography variant="h6" mb={2}>Editar Curso</Typography>
          <Stack spacing={2}>
            <TextField
              label="Nombre"
              name="name"
              value={editCourse?.name || ""}
              onChange={handleEditChange}
              fullWidth
              required
            />
            <TextField
              label="Descripción"
              name="description"
              value={editCourse?.description || ""}
              onChange={handleEditChange}
              fullWidth
              multiline
              minRows={2}
            />
            {editError && <Alert severity="error">{editError}</Alert>}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={handleCloseEdit}>Cancelar</Button>
              <Button variant="contained" onClick={handleEdit} disabled={loading}>
                Guardar
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Dialog>

      {/* Modal de confirmación para eliminar curso */}
      <Dialog open={openDelete} onClose={handleCloseDelete} maxWidth="xs" fullWidth>
        <Paper sx={{ p: 3, bgcolor: '#fff7f7' }}>
          <Typography variant="h6" color="error" mb={2} align="center">
            ¿Eliminar curso?
          </Typography>
          {courseToDelete && (
            <Stack spacing={2} mb={2}>
              <Typography variant="subtitle2" color="text.secondary">Nombre</Typography>
              <Typography variant="body1">{courseToDelete.name}</Typography>
              <Typography variant="subtitle2" color="text.secondary">Descripción</Typography>
              <Typography variant="body2">{courseToDelete.description}</Typography>
            </Stack>
          )}
          {deleteError && <Alert severity="error">{deleteError}</Alert>}
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
            <Button onClick={handleCloseDelete}>Cancelar</Button>
            <Button variant="contained" color="error" onClick={handleDelete} disabled={loading}>
              Eliminar
            </Button>
          </Stack>
        </Paper>
      </Dialog>

      {/* Snackbar de éxito creación */}
      <Snackbar
        open={successSnackbar}
        autoHideDuration={3000}
        onClose={() => setSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert onClose={() => setSuccessSnackbar(false)} severity="success" sx={{ width: '100%' }} elevation={6} variant="filled">
          ¡Curso creado correctamente!
        </MuiAlert>
      </Snackbar>

      {/* Snackbar de éxito edición */}
      <Snackbar
        open={editSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() => setEditSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert onClose={() => setEditSuccessSnackbar(false)} severity="success" sx={{ width: '100%' }} elevation={6} variant="filled">
          ¡Curso editado correctamente!
        </MuiAlert>
      </Snackbar>

      {/* Snackbar de éxito eliminación */}
      <Snackbar
        open={deleteSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() => setDeleteSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert onClose={() => setDeleteSuccessSnackbar(false)} severity="success" sx={{ width: '100%' }} elevation={6} variant="filled">
          ¡Curso eliminado correctamente!
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default AdminCoursesPage;