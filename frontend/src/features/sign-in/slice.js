/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  loading: false,
  errorCode: "",
  message: "",
  authData: {
    code: "",
    error: "",
  },
};
/**
 * Redux slice for the sign in
 */
export const signInSlice = createSlice({
  name: "feature/sign-in",
  initialState,
  reducers: {
    signIn(state) {
      state.loading = true;
    },
    signInSucceeded(state) {
      state.loading = false;
    },
    signInFailed(state, action) {
      state.loading = false;
      state.errorCode = action?.payload?.code;
      state.message = action?.payload?.message;
    },
    setAuthData(state, action) {
      state.authData = action?.payload?.data;
    },
  },
});
//
export const { actions: signInActions } = signInSlice;
