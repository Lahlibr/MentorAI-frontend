import React from 'react';
import ManageUsersPage from '@/Pages/admin/ManageUsersPage';
import ManageProblemsPage from '@/Pages/admin/ManageProblemsPage';
import { AppRoute } from '@/Models/routes';

const adminRoutes : AppRoute[] = [
  {
    path: '/admin/users',
    element: <ManageUsersPage />,
    allowedRoles: ['Admin'],
  },
  {
    path: '/admin/problems',
    element: <ManageProblemsPage />,
    allowedRoles: ['Admin'],
  },
];

export default adminRoutes;
