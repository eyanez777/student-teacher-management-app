import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import AuthProvider from './app/AuthProvider';
import AppLayout from './components/AppLayout';
import DashboardPage from './pages/DashboardPage';
import AdminCoursesPage from './pages/AdminCoursesPage';
import AdminUsersPage from './pages/AdminUsersPage';
import StudentCoursesPage from './pages/StudentCoursesPage';
import StudentProfilePage from './pages/StudentProfilePage';
import LoginPage from './pages/LoginPage'; // Asegúrate de tener este componente
import { useSelector } from 'react-redux';
import type { RootState } from './app/store';

// Componente para proteger rutas privadas
const PrivateRoute: React.FC = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  // Puedes agregar lógica de expiración de token aquí
  return user && token ? <Outlet /> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Login fuera del layout global */}
        <Route path="/login" element={<LoginPage />} />
        {/* Rutas protegidas con menú global */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin/courses" element={<AdminCoursesPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/student/courses" element={<StudentCoursesPage />} />
            <Route path="/student/profile" element={<StudentProfilePage />} />
            {/* Agrega más rutas aquí */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
