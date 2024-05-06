import createBaseRepository from "./base.repository.js";
import { Token } from "./model/index.js";
// Create the role repository
const TokenRepository = createBaseRepository(Token);
// Exporting the role repository
export default TokenRepository;