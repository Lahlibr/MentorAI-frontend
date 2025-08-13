import publicRoutes from './publicRoutes';
import studentRoutes from './studentRoutes';
import reviewerRoutes from './reviewerRoutes';
import adminRoutes from './adminRoutes';
import NotFoundPage from '@/Pages/NotFoundPage';
import { AppRoute } from '@/Models/routes';
import PrivateRoute from '@/Components/Router/PrivateRoute';
import DashboardRouter from '@/Components/Router/DashboardRouter';

const allRoutes : AppRoute[]= [
  ...publicRoutes,
  ...studentRoutes,
  ...reviewerRoutes,
  ...adminRoutes,

  {
    path: '/dashboard',
    element: (
      <PrivateRoute allowedRoles={['Student', 'Reviewer', 'Admin']}>
        <DashboardRouter />
      </PrivateRoute>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
  
];

export default allRoutes;
