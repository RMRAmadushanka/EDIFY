import createBaseRepository from "./base.repository.js";
import { User } from "./model/index.js";

// Create the user repository
const UserRepository = createBaseRepository(User);

// Override or add specific methods for UserRepository
UserRepository.findOne = async function(filter) {
  if (filter.userId) {
    filter._id = { $ne: filter.userId };
    delete filter.userId;
  }
  return User.findOne(filter);
};
//
export default UserRepository;
