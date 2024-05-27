import { call, put, takeLatest } from "redux-saga/effects";
//
import request from "../base/utils/request";
import API from "./constants";
import { signInActions } from "./slice";

/**
 * Generator function for sending the sign in user details
 * @param {Object} payload
 */
export function* signInGenerator({ payload }) {
  try {
    const response = yield call(request, API.POST_SIGN_IN, payload);
    yield put(signInActions.signInSucceeded(response));
  } catch (error) {
    yield put(signInActions.signInFailed(error?.message));
  }
}

/**
 * Redux saga that triggers googleSignIn and signIn functions
 */
export function* signInSaga() {
  yield takeLatest(signInActions.signIn.type, signInGenerator);
}
//
export default signInSaga;
