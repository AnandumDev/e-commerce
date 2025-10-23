import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCategory, categoryReset } from "../features/category/categorySlice";
import toast from "react-hot-toast"; // optional for notifications

const AddCategoryModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: "" });

  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.category
  );

  // Effect to handle success/error messages
  useEffect(() => {
    if (isSuccess) {
      toast.success(message);
      setFormData({ name: "" });
      onClose();
      dispatch(categoryReset());
    }

    if (isError) {
      toast.error(message);
      dispatch(categoryReset());
    }
  }, [isSuccess, isError, message, dispatch, onClose]);

  if (!isOpen) return null;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    dispatch(addCategory(formData));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-96 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Add Category
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Category Name
            </label>
            <input
              onChange={onChange}
              type="text"
              name="name"
              value={formData.name}
              placeholder="Enter category name"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${
              isLoading ? "bg-gray-400" : "bg-gradient-to-r from-green-500 to-green-700"
            } text-white py-2 rounded-lg hover:opacity-90 transition-all`}
          >
            {isLoading ? "Adding..." : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
