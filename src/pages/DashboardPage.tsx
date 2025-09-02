
  
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { Box, Typography, Divider, Card, CardContent, CardActionArea, Paper } from '@mui/material';
// @ts-ignore
import Grid from '@mui/material/Grid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import GroupOffIcon from '@mui/icons-material/GroupOff';
import { fetchUsers } from '../features/users/usersSlice';
import { fetchCourses } from '../features/courses/coursesSlice';
import { useNavigate } from 'react-router-dom';


const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { users, loading: usersLoading } = useSelector((state: RootState) => state.users);
  const { courses, loading: coursesLoading } = useSelector((state: RootState) => state.courses);

  // Promedio de alumnos por curso
  const promedioAlumnosPorCurso = useMemo(() => {
    if (!courses || !courses.length) return 0;
    const total = courses.reduce((acc: number, c: any) => acc + (c.users ? c.users.length : 0), 0);
    return (total / courses.length).toFixed(1);
  }, [courses]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else if (user?.role === 'alumno') {
      navigate('/student/courses', { replace: true });
    }
  }, [token, user, navigate]);

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(fetchUsers());
      dispatch(fetchCourses());
    }
  }, [dispatch, user]);

  // Métricas calculadas (ajustadas a la estructura real)
  const alumnosSinCursos = useMemo(
    () => users.filter((u: any) => u.role === 'alumno' && (!u.courses || u.courses.length === 0)).length,
    [users]
  );

 
  const cursosSinAlumnos = useMemo(
    () => courses.filter((c: any) => !c.users || c.users.length === 0).length,
    [courses]
  );

  if (!user || user.role !== 'admin') {
    return null;
  }

  // Datos para gráfico: alumnos por curso (ajustado a estructura real)
  const alumnosPorCurso = useMemo(
    () =>
      courses.map((c: any) => ({
        nombre: c.name || `Curso ${c.id || ''}`,
        alumnos: c.users ? c.users.length : 0
      })),
    [courses]
  );

  return (
    <Box>
      <Typography variant="h4" mb={2}>Bienvenido, {user.name || 'Usuario'}!</Typography>
      <Typography variant="subtitle1" mb={4}>Panel de administración</Typography>
      <Divider sx={{ mb: 4 }} />
      {/* Grid de métricas principales alineado con gráficos */}
      {/* @ts-ignore */}
      <Grid container spacing={3} mb={2}>
        {/* Usuarios */}
        {/* @ts-ignore */}
        <Grid item xs={12} sm={6} md={3} lg={2.4}>
          <Card sx={{ boxShadow: 3 }}>
            <CardActionArea onClick={() => navigate('/admin/users')}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <PeopleIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h6">Usuarios</Typography>
                    <Typography variant="h4" color="primary.main">
                      {usersLoading ? '...' : users.length}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        {/* Cursos */}
        {/* @ts-ignore */}
        <Grid item xs={12} sm={6} md={3} lg={2.4}>
          <Card sx={{ boxShadow: 3 }}>
            <CardActionArea onClick={() => navigate('/admin/courses')}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <ClassIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h6">Cursos</Typography>
                    <Typography variant="h4" color="secondary.main">
                      {coursesLoading ? '...' : courses.length}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        {/* Alumnos sin cursos */}
        {/* @ts-ignore */}
        <Grid item xs={12} sm={6} md={3} lg={2.4}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PersonOffIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6">Alumnos sin cursos</Typography>
                  <Typography variant="h4" color="warning.main">
                    {usersLoading ? '...' : alumnosSinCursos}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Promedio alumnos/curso */}
        {/* @ts-ignore */}
        <Grid item xs={12} sm={6} md={3} lg={2.4}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleIcon color="info" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6">Promedio alumnos/curso</Typography>
                  <Typography variant="h4" color="info.main">
                    {coursesLoading ? '...' : promedioAlumnosPorCurso}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Cursos sin alumnos */}
        {/* @ts-ignore */}
        <Grid item xs={12} sm={6} md={3} lg={2.4}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <GroupOffIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6">Cursos sin alumnos</Typography>
                  <Typography variant="h4" color="error.main">
                    {coursesLoading ? '...' : cursosSinAlumnos}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Grid de gráficos alineado con las métricas, pero ocupando toda la fila en desktop */}
      {/* @ts-ignore */}
      <Grid container spacing={3} mb={2} alignItems="stretch">
        {/* Gráfico: Alumnos por curso (ocupa toda la fila) */}
        {/* @ts-ignore */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, minHeight: 480, textAlign: 'center', bgcolor: '#f7fafd', height: '100%' }}>
            <Typography variant="h6" mb={2} color="primary">Alumnos por curso</Typography>
            {coursesLoading ? (
              <Typography variant="body1">Cargando gráfico...</Typography>
            ) : (
              <ResponsiveContainer width={700} height={400}>
                <BarChart
                  data={alumnosPorCurso}
                  margin={{ top: 20, right: 40, left: 10, bottom: 60 }}
                  barCategoryGap={30}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="nombre"
                    angle={-25}
                    textAnchor="end"
                    interval={0}
                    height={80}
                    tick={{ fontSize: 13 }}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 14 }} />
                  <Tooltip
                    contentStyle={{ background: '#f7fafd', borderRadius: 8, fontSize: 15 }}
                    cursor={{ fill: '#e3f2fd' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 15 }} />
                  <Bar dataKey="alumnos" fill="#1976d2" name="Alumnos" radius={[8, 8, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
        {/* Espacio para futuros gráficos, también ocuparán toda la fila */}
        {/* @ts-ignore */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, minHeight: 320, textAlign: 'center', bgcolor: '#f7fafd', height: '100%' }}>
            <Typography variant="h6" mb={2} color="primary">Próximamente: más gráficos y métricas</Typography>
          </Paper>
        </Grid>
      </Grid>
      {/* Gráfico real: Alumnos por curso (personalizado) */}
      {/* <Paper elevation={2} sx={{ p: 3, minHeight: 340, textAlign: 'center', bgcolor: '#f7fafd', maxWidth: 900, mx: 'auto', mt: 2 }}>
        <Typography variant="h6" mb={2} color="primary">Alumnos por curso</Typography>
        {coursesLoading ? (
          <Typography variant="body1">Cargando gráfico...</Typography>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={alumnosPorCurso}
              margin={{ top: 20, right: 40, left: 10, bottom: 60 }}
              barCategoryGap={30}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="nombre"
                angle={-25}
                textAnchor="end"
                interval={0}
                height={80}
                tick={{ fontSize: 13 }}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 14 }} />
              <Tooltip
                contentStyle={{ background: '#f7fafd', borderRadius: 8, fontSize: 15 }}
                cursor={{ fill: '#e3f2fd' }}
              />
              <Legend wrapperStyle={{ fontSize: 15 }} />
              <Bar dataKey="alumnos" fill="#1976d2" name="Alumnos" radius={[8, 8, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Paper> */}
    </Box>
  );
};

export default DashboardPage;
