/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
//
import { signInActions } from '../../sign-in/slice';

export const initialState = {
  tokens: {},
  user: {},
  loading: false,
  isSuccessFull: undefined,
  isSessionTimedOut: false,
  loggedIn: false,
};
/**
 * Redux slice for the authentication
 */
export const authSlice = createSlice({
  name: 'feature/base-auth',
  initialState,
  reducers: {
    logout(state) {
      state.loading = true;
    },
    logoutCompleted() {
      return {
        ...initialState,
      };
    },
    removeAuth() {
      return {
        ...initialState,
      };
    },
    refreshToken(state) {
      state.loading = true;
    },
    refreshTokenSucceeded(state, action) {
      state.loading = false;
      state.tokens = action?.payload?.tokens;
      state.isSessionTimedOut = false;
    },
    refreshTokenFailed(state) {
      state.loading = false;
      state.isSessionTimedOut = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInActions.signIn, () => ({
        ...initialState,
      }))
      .addCase(signInActions.signInSucceeded, (state, action) => ({
        ...state,
        tokens: action?.payload?.tokens,
        user: action?.payload?.user,
        loggedIn: true,
      }))
      .addCase(signInActions.signInFailed, (state) => ({
        ...state,
        tokens: {},
        user: {},
      }))
  },
});
//
export const { actions: authActions } = authSlice;
