import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCategory, categoryReset } from "../features/category/categorySlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddCategoryForm = () => {
  const [formData, setFormData] = useState({ name: "" });
  const navigate = useNavigate()

  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.category
  );

  useEffect(() => {
    if (isSuccess) {
      toast.success(message || "Category added successfully!");
      setFormData({ name: "" });
      dispatch(categoryReset());
    }

    if (isError) {
      toast.error(message || "Something went wrong!");
      dispatch(categoryReset());
    }
  }, [isSuccess, isError, message, dispatch]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;
    dispatch(addCategory(formData));
    navigate('/dashboard')
  
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 mx-auto mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Category</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            Category Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="Enter category name"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-green-700"
          } text-white py-2 rounded-lg hover:opacity-90 transition-all`}
        >
          {isLoading ? "Adding..." : "Add"}
        </button>
      </form>
    </div>
  );
};

export default AddCategoryForm;
