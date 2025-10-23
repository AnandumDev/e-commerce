import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "../features/products/productSlice";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { productDetails, isLoading, isError, message } = useSelector((state) => state.product);
  const navigate = useNavigate()
  
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= productDetails.variants[selectedVariant].quantity) {
      setQuantity(newQuantity);
    }
  };

  if (isLoading) return <p>Loading product details...</p>;
  if (isError) return <p className="text-red-600">{message}</p>;
  if (!productDetails) return <p>No product found.</p>;

  const selectedVariantData = productDetails.variants[selectedVariant];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
        
      <div className="max-w-4xl mx-auto mb-4">
        <span className="text-gray-600">Home</span>
        <span className="text-gray-600 mx-2">&gt;</span>
        <span className="text-gray-600">Product details</span>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center mb-4">
              {productDetails.images && productDetails.images.length > 0 ? (
                <img
                  src={`http://localhost:3000/${productDetails.images[selectedImage]}`}
                  alt={productDetails.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-gray-500">No image available</span>
              )}
            </div>
            
            {productDetails.images && productDetails.images.length > 1 && (
              <div className="flex gap-2">
                {productDetails.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 border-2 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={`http://localhost:3000/${img}`}
                      alt={`${productDetails.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">{productDetails.title}</h2>
            <p className="text-2xl font-bold text-gray-900 mb-4">
              ${selectedVariantData.price}
            </p>
            <div className="mb-6">
              <p className="text-green-600 font-medium mb-1">
                Availability: <span className="text-green-600">✓ In stock</span>
              </p>
              <p className="text-orange-500 text-sm">
                Hurry up! only {selectedVariantData.quantity} product left in stock!
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <span className="text-gray-700 font-medium w-20">RAM:</span>
                  <div className="flex space-x-2">
                    {productDetails.variants?.map((variant, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedVariant(idx);
                          setQuantity(1);
                        }}
                        className={`px-4 py-2 border rounded-lg ${
                          selectedVariant === idx
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        {variant.ram}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center mb-6">
                  <span className="text-gray-700 font-medium w-20">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg w-32">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="flex-1 text-center py-2">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity >= selectedVariantData.quantity}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => navigate(`/edit-product/${id}`)}>
                  Edit product
                </button>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Buy it now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;