import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Dialog,
  Paper,
  Divider,
  Snackbar,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  updateUser,
  deleteUser,
  updateUserCourses,
  createUser,
} from "../features/users/usersSlice";
import type { RootState, AppDispatch } from "../app/store";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AdminUsersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.users
  );

  // Estado para detalle
  const [openDetail, setOpenDetail] = useState(false);
  const [detailUser, setDetailUser] = useState<any | null>(null);
  // Estado para edición
  const [openEdit, setOpenEdit] = useState(false);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccessSnackbar, setEditSuccessSnackbar] = useState(false);
  // Estado para cambiar contraseña
  const [openPassword, setOpenPassword] = useState(false);
  const [passwordUser, setPasswordUser] = useState<any | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccessSnackbar, setPasswordSuccessSnackbar] = useState(false);
  // Estado para eliminar
  const [openDelete, setOpenDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const [deleteSuccessSnackbar, setDeleteSuccessSnackbar] = useState(false);
  // Estado para asociar cursos
  const [openAssociate, setOpenAssociate] = useState(false);
  const [associateUser, setAssociateUser] = useState<any | null>(null);
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);
  const [associateError, setAssociateError] = useState<string | null>(null);
  const [associateSuccessSnackbar, setAssociateSuccessSnackbar] =
    useState(false);
  // Estado para cursos
  const [courses, setCourses] = useState<any[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  // Estado para crear usuario
  const [openCreate, setOpenCreate] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccessSnackbar, setCreateSuccessSnackbar] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Fetch cursos al montar
  useEffect(() => {
    const fetchCourses = async () => {
      setCoursesLoading(true);
      setCoursesError(null);
      try {
        const res = await api.get("/courses");
        setCourses(res.data);
      } catch (err: any) {
        setCoursesError(
          err?.response?.data?.message || "Error al obtener cursos"
        );
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Handlers detalle
  const handleViewDetails = (user: any) => {
    setDetailUser(user);
    setOpenDetail(true);
  };
  const handleCloseDetail = () => setOpenDetail(false);

  // Handlers edición
  const handleOpenEdit = (user: any) => {
    setEditUser({ ...user });
    setEditError(null);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => setOpenEdit(false);
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };
  const handleEdit = async () => {
    if (!editUser.name.trim()) {
      setEditError("El nombre es obligatorio");
      return;
    }
    // Validar contraseña solo si se está cambiando
    if (editUser.password && editUser.password.length > 0) {
      const password = editUser.password;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(password)) {
        setEditError(
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número."
        );
        return;
      }
    }
    try {
      // Siempre incluir password (vacío si no se cambia) para cumplir con el tipo requerido
      const dataToSend = {
        name: editUser.name,
        email: editUser.email,
        role: editUser.role,
        password: editUser.password ? editUser.password : "",
      };
      await dispatch(
        updateUser({ id: editUser.id, data: dataToSend })
      ).unwrap();
      setOpenEdit(false);
      setEditSuccessSnackbar(true);
    } catch (err: any) {
      setEditError(err || "Error al editar usuario");
    }
  };

  // Handlers eliminar
  const handleOpenDelete = (user: any) => {
    setUserToDelete(user);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => setOpenDelete(false);
  const handleDelete = async () => {
    try {
      await dispatch(deleteUser(userToDelete.id)).unwrap();
      setOpenDelete(false);
      setDeleteSuccessSnackbar(true);
    } catch (err) {
      // Manejo de error opcional
    }
  };

  // Handlers asociar cursos
  const handleOpenAssociate = (user: any) => {
    setAssociateUser(user);
    setSelectedCourseIds(
      user.courses ? user.courses.map((c: any) => c.id) : []
    );
    setAssociateError(null);
    setOpenAssociate(true);
  };
  const handleCloseAssociate = () => setOpenAssociate(false);
  const handleToggleCourse = (courseId: number) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };
  const handleAssociate = async () => {
    if (!associateUser) return;
    try {
      await dispatch(
        updateUserCourses({
          id: associateUser.id,
          courseIds: selectedCourseIds,
        })
      ).unwrap();
      setOpenAssociate(false);
      setAssociateSuccessSnackbar(true);
    } catch (err: any) {
      setAssociateError(err || "Error al asociar cursos");
    }
  };

  // Handlers crear usuario
  const handleOpenCreate = () => {
    setNewUser({ name: "", email: "", role: "", password: "" });
    setCreateError(null);
    setOpenCreate(true);
  };
  const handleCloseCreate = () => setOpenCreate(false);
  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };
  const handleCreate = async () => {
    if (
      !newUser.name.trim() ||
      !newUser.email.trim() ||
      !newUser.role.trim() ||
      !newUser.password.trim()
    ) {
      setCreateError("Todos los campos son obligatorios");
      return;
    }
    try {
      const resp = await dispatch(createUser(newUser)).unwrap();
      console.log(resp);
      setOpenCreate(false);
      setCreateSuccessSnackbar(true);
    } catch (err: any) {
      setCreateError(err || "Error al crear usuario");
    }
  };

  // Handler para modal de cambio de contraseña
  const handleOpenPassword = (user: any) => {
    setPasswordUser(user);
    setNewPassword("");
    setPasswordError(null);
    setOpenPassword(true);
  };
  const handleClosePassword = () => setOpenPassword(false);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewPassword(e.target.value);
  const handleSavePassword = async () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setPasswordError(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número."
      );
      return;
    }
    try {
      // Enviar todos los campos requeridos por el backend
      const dataToSend = {
        name: passwordUser.name,
        email: passwordUser.email,
        role: passwordUser.role,
        password: newPassword,
      };
      await dispatch(
        updateUser({ id: passwordUser.id, data: dataToSend })
      ).unwrap();
      setOpenPassword(false);
      setPasswordSuccessSnackbar(true);
    } catch (err: any) {
      setPasswordError(err || "Error al cambiar la contraseña");
    }
  };

  // Columnas con handlers
  const columns: GridColDef[] = [
    { field: "name", headerName: "Nombre", width: 180 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "role", headerName: "Rol", width: 120 },
    {
      field: "actions",
      headerName: "Acciones",
      width: 120,
      sortable: false,
      renderCell: (params: any) => {
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(
          null
        );
        const open = Boolean(anchorEl);
        const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget);
        };
        const handleMenuClose = () => {
          setAnchorEl(null);
        };
        const handleView = () => {
          handleViewDetails(params.row);
          handleMenuClose();
        };
        const handleEditUser = () => {
          handleOpenEdit(params.row);
          handleMenuClose();
        };
        const handleDeleteUser = () => {
          handleOpenDelete(params.row);
          handleMenuClose();
        };
        const handleAssociateCourses = () => {
          handleOpenAssociate(params.row);
          handleMenuClose();
        };
        const handleChangePassword = () => {
          handleOpenPassword(params.row);
          handleMenuClose();
        };
        return (
          <>
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              aria-controls={open ? "actions-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="actions-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <MenuItem onClick={handleView}>Ver Cursos</MenuItem>
              <MenuItem onClick={handleEditUser}>Editar</MenuItem>
              <MenuItem onClick={handleDeleteUser}>Eliminar</MenuItem>
              <MenuItem onClick={handleAssociateCourses}>
                Asociar Cursos
              </MenuItem>
              <MenuItem onClick={handleChangePassword}>
                Cambiar contraseña
              </MenuItem>
            </Menu>
          </>
        );
      },
    },
  ];

  return (
    <Box mt={5} ml={5} mr={5}>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="300px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {error && <Alert severity="error">{error}</Alert>}
          <Typography variant="h4" mb={2}>
            Gestión de Usuarios 2 (Admin)
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
            onClick={handleOpenCreate}
          >
            Crear Usuario
          </Button>
          <Box position="relative">
            <DataGrid
              rows={users}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5, page: 0 },
                },
              }}
              disableRowSelectionOnClick
              sx={{ backgroundColor: "#f0f0f0" }}
            />
          </Box>

          <Button
            
            variant="outlined"
            sx={{ mb: 2, marginTop:1.5 }}
            onClick={() => navigate("/dashboard")}
          >
            Volver
          </Button>
        </>
      )}

      {/* Modal de detalle */}
      <Dialog
        open={openDetail}
        onClose={handleCloseDetail}
        maxWidth="xs"
        fullWidth
      >
        <Paper sx={{ p: 3, bgcolor: "#f7f7fa" }}>
          <Typography variant="h6" mb={2} align="center" color="primary">
            Detalle del Usuario
          </Typography>

          {detailUser && (
            <>
              <Typography variant="subtitle2" color="text.secondary">
                Cursos
              </Typography>
              <List dense sx={{ maxHeight: 250, overflow: "auto", mb: 1 }}>
                {(Array.isArray(detailUser.courses)
                  ? detailUser.courses
                  : []
                ).map((course: any) => (
                  <ListItem key={course.id}>
                    <ListItemText primary={course.name} />
                  </ListItem>
                ))}
              </List>
              {/* Puedes agregar más campos aquí */}
            </>
          )}
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
            <Button
              onClick={handleCloseDetail}
              variant="contained"
              color="primary"
            >
              Cerrar
            </Button>
          </Stack>
        </Paper>
      </Dialog>

      {/* Modal para editar */}
      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="xs" fullWidth>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>
            Editar Usuario
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Nombre"
              name="name"
              value={editUser?.name || ""}
              onChange={handleEditChange}
              fullWidth
              required
            />
            <TextField
              label="Email"
              name="email"
              value={editUser?.email || ""}
              onChange={handleEditChange}
              fullWidth
              required
            />
            <TextField
              label="Rol"
              name="role"
              value={editUser?.role || ""}
              onChange={handleEditChange}
              fullWidth
              required
            />

            {editError && <Alert severity="error">{editError}</Alert>}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={handleCloseEdit}>Cancelar</Button>
              <Button variant="contained" onClick={handleEdit}>
                Guardar
              </Button>
            </Stack>
            {/* Modal para cambiar contraseña */}
            <Dialog
              open={openPassword}
              onClose={handleClosePassword}
              maxWidth="xs"
              fullWidth
            >
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" mb={2}>
                  Cambiar contraseña
                </Typography>
                <Typography variant="body2" mb={2} color="text.secondary">
                  La contraseña actual no se puede visualizar por seguridad.
                  Asigna una nueva contraseña segura.
                </Typography>
                <TextField
                  label="Nueva contraseña"
                  type="password"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  fullWidth
                  helperText="Debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número."
                  sx={{ mb: 2 }}
                />
                {passwordError && (
                  <Alert severity="error">{passwordError}</Alert>
                )}
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button onClick={handleClosePassword}>Cancelar</Button>
                  <Button variant="contained" onClick={handleSavePassword}>
                    Guardar
                  </Button>
                </Stack>
              </Paper>
            </Dialog>
            <Snackbar
              open={passwordSuccessSnackbar}
              autoHideDuration={3000}
              onClose={() => setPasswordSuccessSnackbar(false)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                onClose={() => setPasswordSuccessSnackbar(false)}
                severity="success"
                sx={{ width: "100%" }}
              >
                ¡Contraseña cambiada correctamente!
              </Alert>
            </Snackbar>
          </Stack>
        </Paper>
      </Dialog>

      {/* Modal para eliminar */}
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        maxWidth="xs"
        fullWidth
      >
        <Paper sx={{ p: 3, bgcolor: "#fff7f7" }}>
          <Typography variant="h6" color="error" mb={2} align="center">
            ¿Eliminar usuario?
          </Typography>
          {userToDelete && (
            <Stack spacing={2} mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Nombre
              </Typography>
              <Typography variant="body1">{userToDelete.name}</Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body2">{userToDelete.email}</Typography>
            </Stack>
          )}
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
            <Button onClick={handleCloseDelete}>Cancelar</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Eliminar
            </Button>
          </Stack>
        </Paper>
      </Dialog>

      {/* Modal para asociar cursos */}
      <Dialog
        open={openAssociate}
        onClose={handleCloseAssociate}
        maxWidth="sm"
        fullWidth
      >
        <Paper sx={{ p: 3, bgcolor: "#f7f7fa" }}>
          <Typography variant="h6" mb={2} align="center" color="secondary">
            Asociar Cursos al Usuario
          </Typography>
          {associateUser && (
            <>
              <Typography variant="subtitle2" color="text.secondary">
                Usuario
              </Typography>
              <Typography variant="body1" mb={1}>
                {associateUser.name}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" color="text.secondary">
                Selecciona los cursos a asociar
              </Typography>
              <List dense sx={{ maxHeight: 250, overflow: "auto", mb: 1 }}>
                {courses.map((course: any) => (
                  <ListItem key={course.id} disablePadding>
                    <Stack
                      direction="row"
                      alignItems="center"
                      width="100%"
                      onClick={() => handleToggleCourse(course.id)}
                      sx={{
                        cursor: "pointer",
                        px: 2,
                        py: 1,
                        bgcolor: selectedCourseIds.includes(course.id)
                          ? "#e3f2fd"
                          : "inherit",
                      }}
                    >
                      <ListItemText primary={course.name} />
                      <input
                        type="checkbox"
                        checked={selectedCourseIds.includes(course.id)}
                        onChange={() => handleToggleCourse(course.id)}
                        style={{ marginLeft: 8 }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Stack>
                  </ListItem>
                ))}
              </List>
              {associateError && (
                <Alert severity="error">{associateError}</Alert>
              )}
              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                mt={3}
              >
                <Button onClick={handleCloseAssociate}>Cancelar</Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleAssociate}
                >
                  Guardar
                </Button>
              </Stack>
            </>
          )}
        </Paper>
      </Dialog>

      {/* Modal para crear usuario */}
      <Dialog
        open={openCreate}
        onClose={handleCloseCreate}
        maxWidth="xs"
        fullWidth
      >
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>
            Crear Usuario
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Nombre"
              name="name"
              value={newUser.name}
              onChange={handleCreateChange}
              fullWidth
              required
            />
            <TextField
              label="Email"
              name="email"
              value={newUser.email}
              onChange={handleCreateChange}
              fullWidth
              required
            />
            <TextField
              label="Password"
              name="password"
              value={newUser.password}
              onChange={handleCreateChange}
              fullWidth
              required
            />
            <TextField
              label="Rol"
              name="role"
              value={newUser.role}
              onChange={handleCreateChange}
              fullWidth
              required
            />
            {createError && <Alert severity="error">{createError}</Alert>}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={handleCloseCreate}>Cancelar</Button>
              <Button variant="contained" onClick={handleCreate}>
                Guardar
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Dialog>

      {/* Snackbars de éxito */}
      <Snackbar
        open={editSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() => setEditSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setEditSuccessSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          ¡Usuario editado correctamente!
        </Alert>
      </Snackbar>
      <Snackbar
        open={deleteSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() => setDeleteSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setDeleteSuccessSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          ¡Usuario eliminado correctamente!
        </Alert>
      </Snackbar>
      <Snackbar
        open={associateSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() => setAssociateSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAssociateSuccessSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          ¡Cursos asociados correctamente!
        </Alert>
      </Snackbar>
      <Snackbar
        open={createSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() => setCreateSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setCreateSuccessSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          ¡Usuario creado correctamente!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminUsersPage;
