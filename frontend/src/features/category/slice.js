import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  logoUploadLoading: false,
  logoUploadCompleted: false,
  categories: [],
  subCategories: [],
  uploadLogo: {},
  addCategoryLoading: false,
  addSubCategoryLoading: false,
  errorCode: "",
  message: "",
  pagination: [
    {
      total: 0,
      limit: 10,
      page: 1,
      totalPages: 0,
    },
  ],
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
      state.categories = [...state.categories, action.payload];
    },
    addCategoryFailed(state, action) {
      state.addCategoryLoading = false;
      state.errorCode = action.payload.code;
      state.message = action.payload.message;
    },
    addSubCategory(state) {
      state.addSubCategoryLoading = true;
    },
    addSubCategorySucceeded(state, action) {
      state.addSubCategoryLoading = false;
      state.subCategories = [...state.subCategories, action.payload];
      // Directly add the new subcategory to the corresponding category
      const category = state.categories.find(
        (category) => category._id === action.payload.category
      );
      category?.subcategories.push(action.payload);
    },
    addSubCategoryFailed(state, action) {
      state.addSubCategoryLoading = false;
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
    fetchCategories(state) {
      state.addCategoryLoading = true;
    },
    fetchCategoriesSucceeded(state, action) {
      state.addCategoryLoading = false;
      state.categories = action.payload.data;
      state.pagination = {
        ...state.pagination,
        total: action.payload.total,
        limit: action.payload.limit,
        page: action.payload.page,
        totalPages: action.payload.totalPages,
      };
    },
    fetchCategoriesFailed(state, action) {
      state.addCategoryLoading = false;
      state.errorCode = action.payload.code;
      state.message = action.payload.message;
    },
  },
});

export const { actions: categoryAction } = categorySlice;
export default categorySlice.reducer;
