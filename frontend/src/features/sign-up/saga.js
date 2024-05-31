/* eslint-disable import/no-cycle */
import { call, put, takeLatest } from 'redux-saga/effects';
//
import request from 'features/base/utils/request';
import { signInActions } from 'features/sign-in/slice';
import API from './constants';
/**
 * Generator function for sending the code that contains google sso redirect url
 * @param {Object} payload
 */
function* googleSignInRedirect({ payload }) {
  try {
    const response = yield call(request, API.POST_GOOGLE_SIGN_IN, payload);
    yield put(signInActions.googleSignInSuccess(response));
  } catch (error) {
    yield put(signInActions.googleSignInFailure(error?.message));
  }
}
/**
 * Generator function for sending the sign in user details
 * @param {Object} payload
 */
export function* signInGenerator({ payload }) {
  try {
    const response = yield call(request, API.POST_SIGN_IN, payload);
    yield put(signInActions.signInSucceeded(response));
  } catch (error) {
    yield put(
      signInActions.signInFailed({
        message: 'You have entered an Invalid email address or password.',
      })
    );
  }
}
/**
 * Redux saga that triggers googleSignIn and signIn functions
 */
export function* signInSaga() {
  yield takeLatest(signInActions.googleSignIn.type, googleSignInRedirect);
  yield takeLatest(signInActions.signIn.type, signInGenerator);
}
//
export default signInSaga;
