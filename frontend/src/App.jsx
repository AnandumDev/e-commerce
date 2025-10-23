import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import DashBoard from './pages/DashBoard'
import Register from './pages/Register'
import AddProductPage from './components/AddProductModal'
import AddSubCategoryPage from './components/AddSubCategory'
import AddCategoryForm from './components/AddCategoryModal'
import ProductDetails from './pages/ProductDetails'
import EditProductPage from './pages/ProfileEdit'



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/add-subcategory" element={<AddSubCategoryPage/>} />
        <Route path="/add-category" element={<AddCategoryForm />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/edit-product/:id" element={<EditProductPage />} />
      </Routes>
    </Router>
  )
}

export default App
