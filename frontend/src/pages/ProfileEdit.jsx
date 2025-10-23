import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails, updateProducts } from "../features/products/productSlice";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EditProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { productDetails, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.product
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subCategory: "",
    images: [],
    variants: [{ ram: "", price: "", quantity: "" }],
  });

  useEffect(() => {
    if (id) dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (productDetails) {
      setFormData({
        title: productDetails.title,
        description: productDetails.description,
        subCategory: productDetails.subCategory?._id || "",
        images: [],
        variants: productDetails.variants || [],
      });
    }
  }, [productDetails]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setFormData({ ...formData, images: files });
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...formData.variants];
    updated[index][field] = value;
    setFormData({ ...formData, variants: updated });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { ram: "", price: "", quantity: "" }],
    });
  };

  const removeVariant = (index) => {
    const updated = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("subCategory", formData.subCategory);
    data.append("variants", JSON.stringify(formData.variants));
    formData.images.forEach((file) => data.append("images", file));

    dispatch(updateProducts({ id, productData: data }))
      .unwrap()
      .then(() => {
        toast.success("Product updated successfully!");
        navigate("/dashboard");
      })
      .catch((err) => toast.error(err.message));
  };

  if (isLoading && !productDetails) return <p>Loading...</p>;
  if (isError) return <p className="text-red-500">{message}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Edit Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 h-24"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Upload New Images (max 5)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            <div className="flex gap-2 mt-2">
              {formData.images.map((file, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-20 h-20 rounded-lg border object-cover"
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Variants</label>
            {formData.variants.map((variant, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="number"
                  placeholder="RAM"
                  value={variant.ram}
                  onChange={(e) => handleVariantChange(index, "ram", e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg p-2"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg p-2"
                  required
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={variant.quantity}
                  onChange={(e) => handleVariantChange(index, "quantity", e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg p-2"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="bg-red-500 text-white px-2 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addVariant}
              className="text-green-600 text-sm mt-1"
            >
              + Add Variant
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2 rounded-lg hover:opacity-90 transition"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;
