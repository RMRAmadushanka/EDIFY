import { catchAsync } from '../utils/catch-async.js';
import * as categoryService from '../services/category.service.js';

export const addCategory = catchAsync(async (req, res) => {
  const result = await categoryService.addCategory(req.body);
  res.send(result);
});

export const getCategories = catchAsync(async (req, res) => {
  const result = await categoryService.getCategories(req.query, req.options);
  res.send(result);
});
/**
 * Upload logo for category
 **/
export const uploadCategoryLogo = catchAsync(async (req, res) => {
  const result = await categoryService.uploadCategoryLogo(req.files);
  res.send(result);
});