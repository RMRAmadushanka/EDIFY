import { getRepositoryFactor } from "../utils/application-store.js";
import REPOSITORY_TYPES from "../repository/config/repository-types.js";
import * as s3Service from "./s3.service.js";

export const addCategory = async (categoryData) => {
  const categoryRepository = getRepositoryFactor().get(
    REPOSITORY_TYPES.CATEGORY
  );
  return categoryRepository.save(categoryData);
};

export const getCategories = async (filter, options) => {
  const categoryRepository = getRepositoryFactor().get(
    REPOSITORY_TYPES.CATEGORY
  );
  return categoryRepository.getPaginatedList(filter, options);
};

export const uploadCategoryLogo = async (files) => {
  return s3Service.uploadFiles(files, "category_logos");
};
