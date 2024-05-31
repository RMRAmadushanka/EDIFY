/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { cognitoGoogleURL } from 'features/base/constants/google-domain';
import { OAUTH_WINDOW_HEIGHT, OAUTH_WINDOW_LEFT, OAUTH_WINDOW_TOP, OAUTH_WINDOW_WIDTH } from 'features/base/constants/oauth-window-styling';

export const initialState = {
  loading: false,
  errorCode: '',
  message: '',
  authData: {
    code: '',
    error: '',
  },
  mergeModalOpen: false,
};
/**
 * Redux slice for the sign in
 */
export const signInSlice = createSlice({
  name: 'feature/sign-in',
  initialState,
  reducers: {
    googleSignIn(state) {
      state.loading = true;
    },
    googleSignInSuccess(state) {
      state.loading = false;
    },
    googleSignInFailure(state, action) {
      state.loading = false;
      state.errorCode = action?.payload?.code;
      state.message = action?.payload?.message;
    },
    signIn(state) {
      state.loading = true;
    },
    signInSucceeded(state) {
      state.loading = false;
    },
    signInFailed(state) {
      state.loading = false;
    },
    setAuthData(state, action) {
      state.authData = action?.payload?.data;
    },
    openOAuthWindow() {
      window.open(cognitoGoogleURL, 'myWindow', `width=${OAUTH_WINDOW_WIDTH},height=${OAUTH_WINDOW_HEIGHT},top=${OAUTH_WINDOW_TOP},left=${OAUTH_WINDOW_LEFT}`);
    },
    handleMergeModalChange(state, action) {
      return {
        ...state,
        mergeModalOpen: action?.payload,
      };
    },
  },
});
//
export const { actions: signInActions } = signInSlice;
