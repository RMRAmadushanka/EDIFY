import createBaseRepository from "./base.repository.js";
import { Product } from "./model/index.js";
// Create the product repository
const ProductRepository = createBaseRepository(Product);
// Exporting the Product repository
export default ProductRepository;