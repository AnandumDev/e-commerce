import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";

const user = JSON.parse(localStorage.getItem('user'))

export const loginUser = createAsyncThunk(
    '/auth/loginUser',
    async (userData, thunkAPI) => {
        try {
            return await authService.login(userData)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || "Something went wrong"
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const registerUser = createAsyncThunk(
    '/auth/registerUser',
    async (userData, thunkAPI) => {
        try {
            return await authService.register(userData)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || "Something went wrong"
            return thunkAPI.rejectWithValue(message)
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: user ? user : null,
        isLoading: false,
        isError: false,
        isSucess: false,
        message: "" 
    },
    reducers: {
        logout: (state) => {
            state.user = null
            state.isError = false
            localStorage.removeItem('user')
        },
        reset: (state) => {
        state.user =  null
        state.isLoading = false
        state.isError = false
        state.isSucess = false
        state.message = "" 
        }
    },
    extraReducers: (bulider) => {
        bulider
         .addCase(loginUser.pending, (state) => {
            state.isLoading = true
         })
         .addCase(registerUser.pending, (state) => {
            state.isLoading = true
         })
         .addCase(registerUser.fulfilled, (state, action) => {
            state.user = action.payload
            state.isLoading = false
            state.error = false
            state.isSucess = true
            state.message = action.payload.message
         })
         .addCase(loginUser.fulfilled, (state, action) => {
            state.user = action.payload
            state.isLoading = false
            state.error = false
            state.isSucess = true
            state.message = action.payload.message
         })
         .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.isSucess = false
            state.user = null
            state.message = action.payload
         })
         .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.isSucess = false
            state.user = null
            state.message = action.payload
         })
    }
})

export const  { logout, reset } = authSlice.actions
export default authSlice.reducer
