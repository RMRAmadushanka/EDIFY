/* eslint-disable import/no-cycle */
import createSagaMiddleware from '@redux-saga/core';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import hardSet from 'redux-persist/es/stateReconciler/hardSet';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import rootSaga from '../root-saga';
//
import { ENVIRONMENT } from '../config';
import logger from '../features/base/utils/logger';
import { signInSlice } from '../features/sign-in/slice';
import { authSlice } from '../features/base/auth/slice';
import { productSlice } from '../features/products/slice';
import { notificationSlice } from '../features/base/notifications/slice';
import { categorySlice } from '../features/category/slice';


const sagaMiddleware = createSagaMiddleware();
/**
 * Setup encryption using secret key
 */
const encryption = encryptTransform({
  secretKey: ENVIRONMENT.PERSIST_ENCRYPTED_SECRET_KEY,
  onError(error) {
    logger.error(error);
  },
});
/**
 * White listed slices which needs to be persist with encryption
 */
const persistConfig = {
  version: ENVIRONMENT.PERSIST_VERSION,
  key: ENVIRONMENT.PERSIST_CONFIG_KEY,
  storage,
  stateReconciler: hardSet,
  transforms: [encryption],
  whitelist: ['feature/base-auth'],
  writeFailHandler(error) {
    logger.error(error);
  },
};
/**
 * Combine all the persist and non persist reducers
 */
const reducers = combineReducers({
  'feature/base-auth': authSlice.reducer,
  'feature/sign-in': signInSlice.reducer,
  'feature/product': productSlice.reducer,
  'feature/notification': notificationSlice.reducer,
  'feature/category': categorySlice.reducer,
});
/**
 * Define what are the slice which needs to be persist
 */
const persistedReducer = persistReducer(persistConfig, reducers);
/**
 * Register all the slices into the main store
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
    sagaMiddleware,
  ],
});
sagaMiddleware.run(rootSaga);
persistStore(store);
//
export default store;
