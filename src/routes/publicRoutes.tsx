import React from 'react';
import LoginPage from '@/Pages/auth/LoginPage';
import RegisterPage from '@/Pages/auth/RegisterPage';
import { AppRoute } from '@/Models/routes';

const publicRoutes : AppRoute[] = [
  {
    path: '/login',
    element: <LoginPage />,
    public: true,
  },
  {
    path: '/register',
    element: <RegisterPage />,
    public: true,
  },
];

export default publicRoutes;
