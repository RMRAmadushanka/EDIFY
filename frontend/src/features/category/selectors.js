import { createSelector } from '@reduxjs/toolkit';
//
import { initialState } from './slice';
/**
 * Function to select the slice domain
 * @param {Object} state
 * @returns {Object}
 */
const selectDomain = (state) => state['feature/category'] || initialState;
/**
 * Function to retrieve select logo state
 */
export const selectUploadedLogo = createSelector(
  [selectDomain],
  (categoryState) => categoryState.uploadLogo
);

/**
 * Function to retrieve select logo state
 */
export const selectCategories = createSelector(
    [selectDomain],
    (categoryState) => categoryState.categories
  );
  /**
 * Function to retrieve select logo state
 */
export const selectUploadStatus = createSelector(
    [selectDomain],
    (categoryState) => categoryState.logoUploadCompleted
  );
  