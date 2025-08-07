import { AppRoute } from '@/Models/routes';
import PendingReviewsPage from '@/Pages/reviewer/PendingReviewsPage';
import React from 'react';


const reviewerRoutes:AppRoute[] = [
  {
    path: '/pending-reviews',
    element: <PendingReviewsPage />,
    allowedRoles: ['Reviewer'],
  },
];

export default reviewerRoutes;
