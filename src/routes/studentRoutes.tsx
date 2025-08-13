import React from 'react';
import ProblemListPage from '@/Pages/student/ProblemListPage';
import ProblemDetailPage from '@/Pages/student/ProblemDetailPage';
import MyReviewsPage from '@/Pages/student/MyReviewsPage';
import { AppRoute } from '@/Models/routes';
import AddProblemPage from '@/Pages/admin/AddProblem';

const studentRoutes:AppRoute[] = [
  {
    path: '/problems',
    element: <ProblemListPage />,
    allowedRoles: ['Student'],
  },
  {
    path: '/problems/:id',
    element: <ProblemDetailPage />,
    allowedRoles: ['Student'],
  },
  {
    path: '/my-reviews',
    element: <MyReviewsPage />,
    allowedRoles: ['Student'],
  },
  
];

export default studentRoutes;
