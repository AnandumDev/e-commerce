import { configureStore } from "@reduxjs/toolkit";
import authSlice from '../features/auth/authSlice'
import categorySlice from "../features/category/categorySlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        category: categorySlice
    }
})

export default store