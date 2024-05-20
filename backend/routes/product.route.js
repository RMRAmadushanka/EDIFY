/**
 * product route
 */
import { Router } from "express";
import * as productController from "../controller/product.controller.js";
import { fileUpload } from "../middleware/multer.js";
export default function (keycloak) {
  const router = Router();

  router.post(
    "/",
    productController.addProduct
  );
  router.post(
    "/upload-product-img",
    fileUpload("file"),
    productController.uploadProductImg
  );
  router.delete("/delete-product-img/:objectId/img/:name", productController.deleteProductImg);

  //
  return router;
}
