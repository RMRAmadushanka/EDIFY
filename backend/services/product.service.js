import * as productRepository from '../repository/product.repository.js'

  /**
 * Create new Product
 **/
export const addProduct = async(productData) =>{

    return productRepository.save(productData);
}