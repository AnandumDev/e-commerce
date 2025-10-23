import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProducts, resetProduct } from "../features/products/productSlice";
import { getSubCategories } from "../features/subCategory/subCategorySlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { subCategories } = useSelector((state) => state.subCategory);
  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.product
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subCategory: "",
    images: [],
    variants: [],
  });

  const [variantInput, setVariantInput] = useState({ ram: "", price: "", quantity: "" });

  useEffect(() => {
    dispatch(getSubCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      setFormData({ title: "", description: "", subCategory: "", images: [], variants: [] });
      setVariantInput({ ram: "", price: "", quantity: "" });
      dispatch(resetProduct());
    }
    if (isError) {
      toast.error(message || "Something went wrong!");
      dispatch(resetProduct());
    }
  }, [isSuccess, isError, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3); 
    setFormData({ ...formData, images: files });
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setVariantInput({ ...variantInput, [name]: value });
  };

  const addVariant = () => {
    const { ram, price, quantity } = variantInput;
    if (!ram || !price || !quantity) {
      toast.error("Please fill all variant fields");
      return;
    }
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        { ram, price: Number(price), quantity: Number(quantity) },
      ],
    });
    setVariantInput({ ram: "", price: "", quantity: "" });
  };

  const removeVariant = (index) => {
    const updatedVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: updatedVariants });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.subCategory || formData.images.length === 0) {
      toast.error("Title, subcategory, and at least one image are required");
      navigate('/dashboard')
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("subCategory", formData.subCategory);
    data.append("variants", JSON.stringify(formData.variants));
    formData.images.forEach((file) => data.append("images", file));

    dispatch(addProducts(data));
    navigate('/dashboard')
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Add Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">SubCategory</label>
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            >
              <option value="">Select SubCategory</option>
              {subCategories?.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name} ({sub.category.name})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Images (up to 3)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            <div className="flex mt-2 gap-2">
              {formData.images.slice(0, 3).map((file, idx) => (
                <div key={idx} className="relative w-24 h-24 border border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${idx}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = formData.images.filter((_, i) => i !== idx);
                      setFormData({ ...formData, images: newImages });
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Variants</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="number"
                name="ram"
                value={variantInput.ram}
                onChange={handleVariantChange}
                placeholder="RAM"
                className="border border-gray-300 rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <input
                type="number"
                name="price"
                value={variantInput.price}
                onChange={handleVariantChange}
                placeholder="Price"
                className="border border-gray-300 rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <input
                type="number"
                name="quantity"
                value={variantInput.quantity}
                onChange={handleVariantChange}
                placeholder="Quantity"
                className="border border-gray-300 rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="button"
                onClick={addVariant}
                className="bg-green-500 text-white px-3 rounded-lg hover:bg-green-600"
              >
                Add
              </button>
            </div>

            {formData.variants.length > 0 && (
              <ul className="mb-2">
                {formData.variants.map((v, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center mb-1 bg-gray-100 p-2 rounded"
                  >
                    {v.ram} - ${v.price} - Qty: {v.quantity}
                    <button
                      type="button"
                      onClick={() => removeVariant(idx)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
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
              onClick={() =>
                setFormData({ title: "", description: "", subCategory: "", images: [], variants: [] })
              }
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

export default AddProductPage;
