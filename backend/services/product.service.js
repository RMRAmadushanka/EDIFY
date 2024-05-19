import * as productRepository from '../repository/product.repository.js'

  /**
 * Create new Product
 **/
export const addProduct = async(productData) =>{

    return productRepository.save(productData);
}
/**
 * Upload logo to product
 **/
export const uploadProductImg = async (files) => {
  return s3Service.uploadFiles(files, 'product_images');
};