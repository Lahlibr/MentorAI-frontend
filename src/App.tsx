import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import Navbar from '@/Components/common/Navbar';
import LoadingSpinner from '@/Components/common/LoadingSpinner';

// Import all your Pages...
import LoginPage from '@/Pages/auth/LoginPage';
import RegisterPage from '@/Pages/auth/RegisterPage';
import StudentDashboard from '@/Pages/student/StudentDashboard';
import ProblemListPage from '@/Pages/student/ProblemListPage';
import ProblemDetailPage from '@/Pages/student/ProblemDetailPage';
import MyReviewsPage from '@/Pages/student/MyReviewsPage';
import ReviewerDashboard from '@/Pages/reviewer/ReviewerDashboard';
import PendingReviewsPage from '@/Pages/reviewer/PendingReviewsPage';
import AdminDashboard from '@/Pages/admin/AdminDashboard';
import ManageUsersPage from '@/Pages/admin/ManageUsersPage';
import ManageProblemsPage from '@/Pages/admin/ManageProblemsPage';
import NotFoundPage from '@/Pages/NotFoundPage';

// Private Route Component
interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  allowedRoles = [],
  redirectTo = '/login'
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-300">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4 transition-colors duration-300">
        <div className="text-center animate-fade-in">
          <div className="mb-8">
            <div className="text-6xl font-bold text-gray-300 dark:text-gray-700 mb-4">403</div>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-pink-500 mx-auto rounded-full mb-6"></div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              You don't have permission to access this page.
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Public Route Component
interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-300">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Main App Content Component
const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading MentorAI...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Navigation Bar - Only show when user is logged in */}
      {user && <Navbar />}
      
      {/* Main Content */}
      <main className={`${user ? 'container mx-auto px-4 py-8' : ''} min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300`}>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } 
          />

          {/* Protected Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                {user?.role === 'Student' && <StudentDashboard />}
                {user?.role === 'Reviewer' && <ReviewerDashboard />}
                {user?.role === 'Admin' && <AdminDashboard />}
                {!['Student', 'Reviewer', 'Admin'].includes(user?.role || '') && (
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Invalid Role
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Your account role is not recognized. Please contact support.
                    </p>
                  </div>
                )}
              </PrivateRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/problems"
            element={
              <PrivateRoute allowedRoles={['Student']}>
                <ProblemListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/problems/:id"
            element={
              <PrivateRoute allowedRoles={['Student']}>
                <ProblemDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-reviews"
            element={
              <PrivateRoute allowedRoles={['Student']}>
                <MyReviewsPage />
              </PrivateRoute>
            }
          />

          {/* Reviewer Routes */}
          <Route
            path="/pending-reviews"
            element={
              <PrivateRoute allowedRoles={['Reviewer']}>
                <PendingReviewsPage />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/users"
            element={
              <PrivateRoute allowedRoles={['Admin']}>
                <ManageUsersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/problems"
            element={
              <PrivateRoute allowedRoles={['Admin']}>
                <ManageProblemsPage />
              </PrivateRoute>
            }
          />

          {/* Default Routes */}
          <Route 
            path="/" 
            element={
              user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            } 
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
};

// Main App Component with Providers
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
