import BaseRepository from "./base.repository.js";
import { Product } from "./model/index.js";

class ProductRepository extends BaseRepository {

    constructor() {
        // resolving the entity type of the user repository which is device entity
        super(Product);
    }

}
/**
 * Exporting product repository. please prevent using the repository directly,
 * use only via the factory repository.
 */
export default ProductRepository;
