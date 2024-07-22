import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  logoUploadLoading: false,
  logoUploadCompleted: false,
  categories: [],
  subCategories: [],
  uploadLogo: {},
  addCategoryLoading: false,
  errorCode: "",
  message: "",
  pagination: {
    total: 0,
    limit: 10,
    page: 1,
    totalPages: 0,
  },
};

export const categorySlice = createSlice({
  name: "feature/category",
  initialState,
  reducers: {
    addCategory(state) {
      state.addCategoryLoading = true;
    },
    addCategorySucceeded(state, action) {
      state.addCategoryLoading = false;
      state.categories = action.payload;
    },
    addCategoryFailed(state, action) {
      state.addCategoryLoading = false;
      state.errorCode = action.payload.code;
      state.message = action.payload.message;
    },
    uploadCategoryLogo(state) {
      state.logoUploadLoading = true;
      state.logoUploadCompleted = false;
    },
    uploadCategoryLogoSucceeded(state, action) {
      state.logoUploadLoading = false;
      state.uploadLogo = action.payload;
      state.logoUploadCompleted = true;
    },
    uploadCategoryLogoFailed(state) {
      state.logoUploadLoading = false;
      state.logoUploadCompleted = true;
    },
  },
});

export const { actions: categoryAction } = categorySlice;
export default categorySlice.reducer;
