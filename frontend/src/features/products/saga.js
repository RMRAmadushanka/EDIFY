import { call, put, takeLatest } from "redux-saga/effects";
//
import request from "../base/utils/request";
import API from "./constants";
import { productActions } from "./slice";

/**
 * Generator function for adding a product
 */
export function* addProductGenerator({ payload }) {
  console.log(payload);
  try {
    const response = yield call(request, API.POST_CREATE_PRODUCT, payload);
    yield put(productActions.addProductSucceeded(response));
  } catch (error) {
    yield put(productActions.addProductFailed(error?.message));
  }
}
/**
 * Generator function for uploading logo
 * @param {Object} payload
 */
function* uploadImgGenerator({ payload }) {
  console.log("payload", payload);
  try {
    const response = yield call(
      request,
      API.POST_UPLOAD_PRODUCT_IMG,
      payload,
      true
    );
    console.log("response", response);
    yield put(productActions.uploadImgSucceeded(response));
  } catch (error) {
    yield put(productActions.uploadImgFailed(error?.message));
  }
}
/**
 * delete product img
 */
export function* deleteProductImgGenerator({ payload }) {
  try {
    const response = yield call(
      request,
      API.DELETE_UPLOAD_PRODUCT_IMG,
      payload
    );
    yield put(productActions.deleteImgSucceeded(response));
  } catch (error) {
    yield put(productActions.deleteImgFailed(error?.message));
  }
}
/**
 * Generator function for getting products
 * @param {Object} payload
 */
export function* getProductsGenerator({ payload }) {
  try {
    const response = yield call(request, API.GET_PRODUCTS, payload);
    yield put(productActions.getProductSucceeded(response));
  } catch (error) {
    yield put(productActions.getProductFailed(error?.message));
  }
}
/**
 * Redux saga that triggers addProduct functions
 */
export function* productSaga() {
  yield takeLatest(productActions.addProduct.type, addProductGenerator);
  yield takeLatest(productActions.uploadImg.type, uploadImgGenerator);
  yield takeLatest(productActions.deleteImg.type, deleteProductImgGenerator);
  yield takeLatest(productActions.getProduct.type, getProductsGenerator);
}
//
export default productSaga;
