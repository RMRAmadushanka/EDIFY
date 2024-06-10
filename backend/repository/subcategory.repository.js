import BaseRepository from './base.repository.js';
import SubCategory from './model/subCategory.model.js';

class SubCategoryRepository extends BaseRepository {
  constructor() {
    super(SubCategory);
  }

  // Add any custom methods related to SubCategory if needed
}

export default SubCategoryRepository;