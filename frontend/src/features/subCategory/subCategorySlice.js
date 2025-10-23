import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import subCategoryService from "./subCategoryService";

export const subCategory = createAsyncThunk(
  "subCategory/add",
  async (subCategoryData, thunkAPI) => {
    try {
      return await subCategoryService.addSubCategory(subCategoryData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getSubCategories = createAsyncThunk(
  "subCategory/getSubCategories",
  async (_, thunkAPI) => {
    try {
      return await subCategoryService.getSubCategories();
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
  addSubCategory: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const subCategorySlice = createSlice({
  name: "subCategory",
  initialState,
  reducers: {
    resetSubCategory: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSubCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.subCategories = action.payload;
      })
      .addCase(getSubCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(subCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(subCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.addSubCategory.push(action.payload.subCategory);
        state.message = action.payload.message;
      })
      .addCase(subCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      });
  },
});

export const { resetSubCategory } = subCategorySlice.actions;
export default subCategorySlice.reducer;
