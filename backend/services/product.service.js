import * as productRepository from '../repository/product.repository.js'
import * as s3Service from './s3.service.js';
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
/**
 * Delete product image
 **/
export const deleteProductImg = async (parameters) => {
  return s3Service.deleteFromS3(parameters);
};