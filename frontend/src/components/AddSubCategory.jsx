import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { subCategory, resetSubCategory } from "../features/subCategory/subCategorySlice";
import { getCategory } from "../features/category/categorySlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddSubCategoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { category } = useSelector((state) => state.category);
  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.subCategory
  );

  const [formData, setFormData] = useState({ categoryId: "", subCategoryName: "" });

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      setFormData({ categoryId: "", subCategoryName: "" });
      dispatch(resetSubCategory());
    }
    if (isError) {
      toast.error(message);
      dispatch(resetSubCategory());
    }
  }, [isSuccess, isError, message, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.subCategoryName.trim()) {
      toast.error("Please select a category and enter a subcategory name.");
      return;
    }

    dispatch(subCategory({ name: formData.subCategoryName, category: formData.categoryId }));
    navigate('/dashboard')
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Add Sub Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Select Category</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">Select category</option>
              {category.length > 0
                ? category.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)
                : <option disabled>No categories available</option>}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Enter Subcategory Name</label>
            <input
              type="text"
              name="subCategoryName"
              value={formData.subCategoryName}
              onChange={handleChange}
              placeholder="Enter sub category name"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-1/2 mr-2 py-2 rounded-lg text-white font-semibold transition-all ${
                isLoading
                  ? "bg-gray-400"
                  : "bg-gradient-to-r from-[#FFBA00] to-[#FF6C00] hover:opacity-90"
              }`}
            >
              {isLoading ? "Adding..." : "ADD"}
            </button>
            <button
              type="reset"
              onClick={() => setFormData({ categoryId: "", subCategoryName: "" })}
              className="w-1/2 ml-2 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all"
            >
              DISCARD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubCategoryPage;
