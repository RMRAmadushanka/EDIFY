import { createSelector } from '@reduxjs/toolkit';
//
import { initialState } from 'features/sign-in/slice';
/**
 * Function to select the slice domain
 * @param {Object} state
 * @returns {Object}
 */
const selectDomain = (state) => state['feature/sign-in'] || initialState;
/**
 * Function to retrieve the entire sign in slice
 */
export const selectSignInState = createSelector([selectDomain], (sighInState) => sighInState);
/**
 * Function to retrieve the loader state of a sign in slice
 */
export const selectLoader = createSelector([selectDomain], (sighInState) => sighInState.loading);
/**
 * Obtain sign in error message from sign in slice
 */
export const selectSignInErrorMessage = createSelector(
  [selectDomain],
  (sighInState) => sighInState.message
);
/**
 * Obtain sign in error code from sign in slice
 */
export const selectSignInErrorCode = createSelector(
  [selectDomain],
  (sighInState) => sighInState.errorCode
);
/**
 * Obtain auth data from sign in slice
 */
export const selectSignInAuthData = createSelector(
  [selectDomain],
  (sighInState) => sighInState.authData
);
/**
 * Obtain merge account popup state from sign in slice
 */
export const selectMergePopupOpen = createSelector(
  [selectDomain],
  (sighInState) => sighInState.mergeModalOpen
);
