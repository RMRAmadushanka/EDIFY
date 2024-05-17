/**
 * product route
 */
import { Router } from "express";
import * as productController from "../../controller/product.controller.js";
export default function (keycloak) {
  const router = Router();

  router.post(
    "/",
    productController.addProduct
  );
  //
  return router;
}
