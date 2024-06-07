import BaseRepository from './base.repository.js';
import Category from './model/category.model.js';

class CategoryRepository extends BaseRepository {
  constructor() {
    super(Category);
  }

  // Add any custom methods related to Category if needed
}

export default CategoryRepository;