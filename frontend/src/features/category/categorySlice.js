import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import categoryService from "./categoryService";

export const addCategory = createAsyncThunk(
    'category/addCategory',
    async (categoryData , thunkAPI ) => {
        try {
            return await categoryService.addCategory(categoryData)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || 'Something went wrong'
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getCategory = createAsyncThunk(
    'category/getCatgory',
    async(_, thunkAPI) => {
        try {
           return await categoryService.getCategory()
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)

const categorySlice = createSlice({
    name: "category",
    initialState: {
        category: [],
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: ""
    },
    reducers: {
        categoryReset: (state) => {
            state.category = []
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ""
        }
    },
    extraReducers: (builder) => {
        builder
         .addCase(addCategory.pending, (state) => {
            state.isLoading = true
         })
         .addCase(addCategory.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.category.push(action.payload)
            state.message = action.payload.message
         })
         .addCase(addCategory.rejected, (state, action) => {
            state.isSuccess = false
            state.isError = true
            state.isLoading = false
            state.message = action.payload
         })
         .addCase(getCategory.pending, (state) => {
            state.isLoading = true
         })
         .addCase(getCategory.fulfilled, (state, action) => {
            state.isLoading = false
            state.category = action.payload
         })
         .addCase(getCategory.rejected, (state, action) => {
            state.isError = true
            state.message = action.payload
            state.isSuccess = false
            state.isLoading = false
         })
    }
})


export const { categoryReset } = categorySlice.actions
export default categorySlice.reducer