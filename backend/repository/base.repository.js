/**
 * base repository defines all generic functionality of the database operations.
 */
export default function createBaseRepository(entityModel) {
    return {
      // Save an entity
      async save(entity) {
        return entityModel.create(entity);
      },
      // Delete an entity by id
      async delete(id) {
        const entityModelInstance = await this.findOne({ _id: id });
        return entityModelInstance.remove();
      },
      // Delete many entities
      async deleteMany(filter) {
        return entityModel.deleteMany(filter);
      },
      // Update an existing entity
      async update(object) {
        await object.save();
        return object;
      },
      // Find an entity by id
      async findById(id) {
        return this.findOne({ _id: id });
      },
      // Find one entity by filter
      async findOne(filter) {
        return entityModel.findOne(filter);
      },
      // Find multiple entities by filter
      async find(filter) {
        return entityModel.find(filter);
      },
      // Get a paginated list of entities
      async getPaginatedList(filter, options) {
        return entityModel.paginate(filter, options);
      },
      // Save a list of entities
      async saveList(entities) {
        return entityModel.insertMany(entities);
      }
    };
  }
  