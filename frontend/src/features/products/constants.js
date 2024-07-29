/**
 * Defines the API paths for sign in
 */
const API = {
  GET_PRODUCTS: {
    path: "/product?:query",
    method: "GET",
  },
  POST_UPLOAD_PRODUCT_IMG: {
    path: "/product/upload-product-img",
    method: "POST",
  },
  DELETE_UPLOAD_PRODUCT_IMG: {
    path: "/product/delete-product-img/:objectId/img/:name",
    method: "DELETE",
  },
  POST_CREATE_PRODUCT: {
    path: "/product/",
    method: "POST",
  },
};
//
export default API;
