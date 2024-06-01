import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  loading: false,
  addProductLoading: false,
  errorCode: "",
  message: "",
  allProducts: [],
  uploadedImg: [],
  uploadedComplete:false,
  products: {},
  addSuccessModalOpen: false,
  pagination: {
    total: 0,
    limit: 10,
    page: 1,
    totalPages: 0,
  },
};

export const productSlice = createSlice({
  name: "feature/product",
  initialState,
  reducers: {
    addProduct(state) {
      state.addProductLoading = true;
    },
    addProductSucceeded(state, action) {
      state.addProductLoading = false;
      state.allProducts = [...state.allProducts, action.payload];
    },
    addProductFailed(state, action) {
      state.addProductLoading = false;
      state.errorCode = action.payload.code;
      state.message = action.payload.message;
    },
    handleToggleAddSuccessModal(state) {

      return {
        ...state,
        addSuccessModalOpen : !state.addSuccessModalOpen,
      };
    },
    getProduct(state) {
      state.loading = true;
    },
    getProductSucceeded(state, action) {
      state.loading = false;
      state.allProducts = action.payload.data;
      state.pagination = {
        ...state.pagination,
        total: action.payload.total,
        totalPages: action.payload.totalPages,
        page: action.payload.page,
        limit: action.payload.limit,
      };
    },
    getProductFailed(state, action) {
      state.loading = false;
      state.errorCode = action.payload.code;
      state.message = action.payload.message;
    },
    uploadImg(state) {
      state.loading = true;
    },
    uploadImgSucceeded(state, action) {
      state.loading = false;
      state.uploadedImg = action.payload
      state.uploadedComplete = true
    },
    
    uploadedState(state){
      return {
        uploadedComplete : state.uploadedComplete
      };
    },
    uploadImgFailed(state) {
      state.loading = false;
      state.uploadedComplete = false
    },
    clearUploadedImages(state) {
      state.uploadedImg =  []
      state.uploadedComplete = false
    },
    deleteImg(state) {
      state.loading = true;
    },
    deleteImgSucceeded(state, action) {
      state.loading = false;
      state.uploadedImg = state.uploadedImg.filter((file) => file.name !== action.payload);
    },
    deleteImgFailed(state) {
      state.loading = false;
    },
  },
});

export const { actions: productActions } = productSlice;

export default productSlice.reducer;
