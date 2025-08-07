import type { ReactElement } from 'react';

export type BaseRoute = {
  path: string;
  element: ReactElement;
};

export type PublicRoute = BaseRoute & {
  public: true;
};

export type PrivateRoute = BaseRoute & {
  allowedRoles: string[];
};

export type AppRoute = PublicRoute | PrivateRoute | BaseRoute;
