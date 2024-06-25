import { getRepositoryFactor } from "../utils/application-store.js";
import REPOSITORY_TYPES from "../repository/config/repository-types.js";

export const addSubCategory = async (subCategoryData) => {
  const subCategoryRepository = getRepositoryFactor().get(
    REPOSITORY_TYPES.SUBCATEGORY
  );
  return subCategoryRepository.save(subCategoryData);
};

export const getSubCategories = async (filter, options) => {
  const { limit, page, sortBy } = options;
  const subCategoryRepository = getRepositoryFactor().get(
    REPOSITORY_TYPES.SUBCATEGORY
  );
  const queryOptions = {
    limit,
    page,
    sort: {},
  };

  if (sortBy) {
    const sortByArray = sortBy.split(":");
    queryOptions.sort[sortByArray[0]] = sortByArray[1] === "desc" ? -1 : 1;
  }

  if (filter.search) {
    return subCategoryRepository.getPaginatedListWithSearch(
      filter,
      queryOptions
    );
  } else {
    return subCategoryRepository.getPaginatedList(filter, queryOptions);
  }
};
