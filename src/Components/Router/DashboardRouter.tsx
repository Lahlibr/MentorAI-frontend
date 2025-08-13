import React from 'react';
import { useAuth } from '@/context/AuthContext';


import ReviewerDashboard from '@/Pages/reviewer/ReviewerDashboard';
import AdminDashboard from '@/Pages/admin/AdminDashboard';
import StudentDashboard from '@/Pages/student/studentDashboard';

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'Student':
      return <StudentDashboard />;
    case 'Reviewer':
      return <ReviewerDashboard />;
    case 'Admin':
      return <AdminDashboard />;
    default:
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Invalid Role
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your account role is not recognized. Please contact support.
          </p>
        </div>
      );
  }
};

export default DashboardRouter;
