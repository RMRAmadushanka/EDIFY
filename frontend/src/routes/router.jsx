

import { SignInForm } from '../features/sign-in/components';
import ROUTES from '../features/base/constants/routes';
import DashboardLayout from '../features/base/layouts/dashboard';

/**
 * Defines the routing structure using array including nested routing.
 * Defines the auth wrapper and private routers for helping to role based routes
 */
const routes = [

  {
    path: ROUTES.WELCOME,
    element: (
        <DashboardLayout />
    ),
    children: [
      {
        path: ROUTES.LOGIN,
        element: <SignInForm />,
      },
    ],
  },

];
//
export default routes;
