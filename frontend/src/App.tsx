import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import { AuthProvider } from './lib/auth-context';
import AuthPage from './pages/auth/auth-page';
import DashboardLayout from './components/layout/dashboard-layout';
import ProtectedRoute from './components/layout/protected-route';
import HomePage from './pages/home/home-page';
import DashboardPage from './pages/dashboard/dashboard-page';
import ProjectsPage from './pages/projects/projects-page';
import ProjectServiceOrdersPage from './pages/projects/project-service-orders-page';
import ServiceOrdersPage from './pages/service-orders/service-orders-page';

import { ToastProvider, ToastViewport } from './components/ui/toast';

import { AnimatePresence } from './components/ui/motion';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <Routes
        location={location}
        key={location.pathname}
      >
        {/* Public routes */}
        <Route
          path='/'
          element={<HomePage />}
        />
        <Route
          path='/auth'
          element={<AuthPage />}
        />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route
              path='/dashboard'
              element={<DashboardPage />}
            />
            <Route
              path='/projects'
              element={<ProjectsPage />}
            />
            <Route
              path='/projects/:projectId/service-orders'
              element={<ProjectServiceOrdersPage />}
            />
            <Route
              path='/service-orders'
              element={<ServiceOrdersPage />}
            />
          </Route>
        </Route>

        {/* Redirect */}
        <Route
          path='*'
          element={<Navigate to='/' />}
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AnimatedRoutes />
          <ToastViewport />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
