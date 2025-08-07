import publicRoutes from './publicRoutes';
import studentRoutes from './studentRoutes';
import reviewerRoutes from './reviewerRoutes';
import adminRoutes from './adminRoutes';
import React from 'react';
import NotFoundPage from '@/Pages/NotFoundPage';
import { AppRoute } from '@/Models/routes';

const allRoutes : AppRoute[]= [
  ...publicRoutes,
  ...studentRoutes,
  ...reviewerRoutes,
  ...adminRoutes,
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default allRoutes;
