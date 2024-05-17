
import * as productService from '../services/product.service.js'
import { catchAsync } from '../utils/catch-async.js';
  /**
 * Add product application programming interface
 **/
export const addProduct = catchAsync(async (req, res) => {
  const result = await productService.addProduct(req.body);
  res.send(result);
});