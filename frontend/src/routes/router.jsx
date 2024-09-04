import { SignInForm } from "../features/sign-in/components";
import ROUTES from "../features/base/constants/routes";
import { HomePage } from "../features/Home-page/components";
import DashboardLayout from "../features/base/layouts/dashboard";
import AuthWrapper from "../features/base/auth/components/auth-wrapper";
import { PrivateRoleRoute } from "../features/base/auth/components";
import {
  AdminDashboard,
  UserDashboard,
} from "../features/Dashboard/components";
import { Page401, Page404 } from "../features/error-pages";
import Sidebar from "../features/base/components/admin-sidebar/Sidebar";
import { AddProduct, ProductTable } from "../features/products/components";
import { CategoryManagement } from "../features/category/components";
import {
  AdminOrderManagement,
  UserOrderManagement,
} from "../features/order/components";

/**
 * Defines the routing structure using array including nested routing.
 * Defines the auth wrapper and private routers for helping to role based routes
 */
const routes = [
  {
    path: ROUTES.WELCOME,
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: ROUTES.LOGIN,
        element: <SignInForm />,
      },
    ],
  },
  {
    path: ROUTES.DASHBOARD,
    element: (
      <AuthWrapper>
        <DashboardLayout />
      </AuthWrapper>
    ),
    children: [
      {
        path: "",
        element: (
          <Sidebar>
            <PrivateRoleRoute
              component={AdminDashboard}
              roles={["super-admin"]}
            />
          </Sidebar>
        ),
      },
      {
        path: "",
        element: (
          <Sidebar>
            <PrivateRoleRoute component={UserDashboard} roles={["user"]} />
          </Sidebar>
        ),
      },
      {
        path: ROUTES.PRODUCT_MANAGEMENT,
        element: (
          <Sidebar>
            <PrivateRoleRoute
              component={ProductTable}
              roles={["super-admin"]}
            />
          </Sidebar>
        ),
      },
      {
        path: ROUTES.ADD_PRODUCT,
        element: (
          <Sidebar>
            <PrivateRoleRoute component={AddProduct} roles={["super-admin"]} />
          </Sidebar>
        ),
      },
      {
        path: ROUTES.CATEGORY_MANAGEMENT,
        element: (
          <Sidebar>
            <PrivateRoleRoute
              component={CategoryManagement}
              roles={["super-admin"]}
            />
          </Sidebar>
        ),
      },
      {
        path: ROUTES.ORDER_MANAGEMENT_ADMIN,
        element: (
          <Sidebar>
            <PrivateRoleRoute
              component={AdminOrderManagement}
              roles={["super-admin"]}
            />
          </Sidebar>
        ),
      },
      {
        path: ROUTES.ORDER_MANAGEMENT_USER,
        element: (
          <Sidebar>
            <PrivateRoleRoute
              component={UserOrderManagement}
              roles={["user"]}
            />
          </Sidebar>
        ),
      },
    ],
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <Page404 />,
  },
  {
    path: ROUTES.NOT_AUTHORIZED,
    element: <Page401 />,
  },
];
//
export default routes;
