
import * as productService from '../services/product.service.js'
import { catchAsync } from '../utils/catch-async.js';
  /**
 * Add product application programming interface
 **/
export const addProduct = catchAsync(async (req, res) => {
  const result = await productService.addProduct(req.body);
  res.send(result);
});
/**
 * Upload logo for product
 **/
export const uploadProductImg = catchAsync(async (req, res) => {
  const result = await productService.uploadProductImg(req.files);
  res.send(result);
});
/**
 * Delete logo for product
 **/
export const deleteProductImg = catchAsync(async (req, res) => {
  console.log("req.name", req.params.name);
  console.log("req.objectId", req.params.objectId);
  const result = await productService.deleteProductImg(req.params);
  res.send(result);
});