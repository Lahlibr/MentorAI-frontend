import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/Components/common/Navbar';
import LoadingSpinner from '@/Components/common/LoadingSpinner';

import allRoutes from '@/routes/allRoutes';

import { useAuth } from '@/context/AuthContext';
import PrivateRoute from './Components/Router/PrivateRoute';
import DashboardRouter from './Components/Router/DashboardRouter';
import PublicRoute from './Components/Router/PublicRoute';
import { ProblemFormProvider } from './context/ProblemFormContext';
import { Provider } from 'react-redux';
import { store } from './store/slices';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {user && <Navbar />}
      <main className={`${user ? 'container mx-auto px-4 py-8' : ''} min-h-screen`}>
        <Routes>
  {allRoutes.map((route) => {
    const { path, element } = route;

    if (path === '/dashboard') {
      return (
        <Route
          key={path}
          path={path}
          element={
            <PrivateRoute allowedRoles={['Student', 'Reviewer', 'Admin']}>
              <DashboardRouter />
            </PrivateRoute>
          }
        />
      );
    }

    if ('public' in route && route.public) {
      return (
        <Route key={path} path={path} element={<PublicRoute>{element}</PublicRoute>} />
      );
    }

    if ('allowedRoles' in route && route.allowedRoles) {
      return (
        <Route
          key={path}
          path={path}
          element={
            <PrivateRoute allowedRoles={route.allowedRoles}>{element}</PrivateRoute>
          }
        />
      );
    }

    return <Route key={path} path={path} element={element} />;
  })}  

  <Route
    path="/"
    element={
      user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
    }
  />
</Routes>

      </main>
    </div>
  );
};

const App: React.FC = () => (
   <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <ProblemFormProvider>
              <Router>
                <AppContent />
              </Router>
          </ProblemFormProvider>
        </AuthProvider>
      </ThemeProvider>
  </Provider>
);

export default App;
