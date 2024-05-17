/**
 * @file index
 * @summary combined express routers for code abstraction
 */
import { Router } from "express";
import authRoute from "./auth.route.js";
export default function initializeRoutes(keycloak) {
  const router = Router();

  const Routes = [
    {
      path: "/auth",
      route: authRoute(keycloak),
    },
    {
      path: "/product",
      route: authRoute(keycloak),
    },
  ];
  Routes.forEach((route) => {
    router.use(route.path, route.route);
  });

  return router;
  //
}
