import { catchAsync } from '../utils/catch-async.js';
import * as subCategoryService from '../services/subcategory.service.js';

export const addSubCategory = catchAsync(async (req, res) => {
  const result = await subCategoryService.addSubCategory(req.body);
  res.send(result);
});

export const getSubCategories = catchAsync(async (req, res) => {
  const result = await subCategoryService.getSubCategories(req.query, req.options);
  res.send(result);
});