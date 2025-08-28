import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import PrivateRoute from '../components/PrivateRoute';
import AdminUsersPage from '../pages/AdminUsersPage';
import AdminCoursesPage from '../pages/AdminCoursesPage';
import StudentCoursesPage from '../pages/StudentCoursesPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      {/* Rutas solo para admin */}
      <Route
        path="/admin/users"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminUsersPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminCoursesPage />
          </PrivateRoute>
        }
      />
      {/* Ruta solo para alumno */}
      <Route
        path="/student/courses"
        element={
          <PrivateRoute allowedRoles={['alumno']}>
            <StudentCoursesPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;
