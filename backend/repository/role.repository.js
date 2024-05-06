import createBaseRepository from "./base.repository.js";
import { Role } from "./model/index.js";
// Create the role repository
const RoleRepository = createBaseRepository(Role);
// Exporting the role repository
export default RoleRepository;