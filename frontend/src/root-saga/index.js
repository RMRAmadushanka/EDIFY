/* eslint-disable import/no-cycle */
import { all, fork } from 'redux-saga/effects';
//
import authSaga  from '../features/base/auth/saga';

/**
 * Register all the saga functions into the root saga
 */
export default function* rootSaga() {
  yield all([
    fork(authSaga),
  ]);
}
