import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productService from "./productService";

// Fetch all products - UPDATED to accept category and subCategory filters
export const getProducts = createAsyncThunk(
  "get/product",
  async (
    { search = "", page = 1, limit = 10, category = "", subCategory = "" } = {},
    thunkAPI
  ) => {
    try {
      return await productService.getProducts(
        search,
        page,
        limit,
        category,
        subCategory
      );
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add a new product
export const addProducts = createAsyncThunk(
  "add/product",
  async (productData, thunkAPI) => {
    try {
      return await productService.addproduct(productData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  "product/details",
  async (id, thunkAPI) => {
    try {
      return await productService.getProductDetails(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateProducts = createAsyncThunk(
  "update/product",
  async ({ id, productData }, thunkAPI) => {
    try {
      return await productService.updateProduct(id, productData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  product: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetProduct: (state) => {
      state.product = null;
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    clearProductError: (state) => {
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Get products
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.product = action.payload;
        state.message = "Products fetched successfully";
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch products";
        state.product = null;
      })

      // Add product
      .addCase(addProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(addProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        if (state.product?.products) {
          state.product.products.unshift(action.payload.product);
          state.product.totalProducts += 1;
        } else {
          state.product = {
            products: [action.payload.product],
            currentPage: 1,
            totalPages: 1,
            totalProducts: 1,
          };
        }

        state.message = action.payload?.message || "Product added successfully";
      })
      .addCase(addProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to add product";
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.productDetails = action.payload;
        state.message = "Product details fetched successfully";
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to fetch product details";
      })
      .addCase(updateProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message =
          action.payload.message || "Product updated successfully";

        if (state.product?.products) {
          const index = state.product.products.findIndex(
            (p) => p._id === action.payload.product._id
          );
          if (index !== -1) {
            state.product.products[index] = action.payload.product;
          }
        }
      })
      .addCase(updateProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to update product";
      });
  },
});

export const { resetProduct, clearProductError } = productSlice.actions;
export default productSlice.reducer;
