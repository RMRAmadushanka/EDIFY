import { call, put, takeLatest } from "redux-saga/effects";
//
import request from "../base/utils/request";
import API from "./constants";
import { categoryAction } from "./slice";

/**
 * Generator function for adding a category
 */
export function* addCategoryGenerator({ payload }) {
  try {
    const response = yield call(request, API.POST_CREATE_CATEGORY, payload);
    yield put(categoryAction.addCategorySucceeded(response));
  } catch (error) {
    yield put(categoryAction.addCategoryFailed(error?.message));
  }
}

function* uploadCategoryLogoGenerator({ payload }) {
  try {
    const response = yield call(request, API.POST_CATEGORY_LOGO, payload, true);
    yield put(categoryAction.uploadCategoryLogoSucceeded(response));
  } catch (error) {
    yield put(categoryAction.uploadCategoryLogoFailed(error?.message));
  }
}

export function* categorySaga() {
  yield takeLatest(categoryAction.addCategory.type, addCategoryGenerator);
  yield takeLatest(
    categoryAction.uploadCategoryLogo.type,
    uploadCategoryLogoGenerator
  );
}

export default categorySaga;
