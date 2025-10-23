import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../features/products/productSlice";
import { getCategory } from "../features/category/categorySlice";
import { getSubCategories } from "../features/subCategory/subCategorySlice";
import { logout } from "../features/auth/authSlice"; // ✅ Import logout
import { Heart, ShoppingCart, LogOut } from "lucide-react"; // Added logout icon
import { useNavigate } from "react-router-dom";

const DashBoard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { product, isLoading, isError, message } = useSelector(
    (state) => state.product
  );
  const { category: categories } = useSelector((state) => state.category);
  const { subCategories } = useSelector((state) => state.subCategory);
  const { user } = useSelector((state) => state.auth);

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(4);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  // Fetch products, categories, and subcategories
  useEffect(() => {
    dispatch(
      getProducts({
        search: searchTerm,
        page: currentPage,
        limit,
        category: selectedCategory,
        subCategory: selectedSubCategory,
      })
    );
    dispatch(getCategory());
    dispatch(getSubCategories());
  }, [
    dispatch,
    searchTerm,
    currentPage,
    limit,
    selectedCategory,
    selectedSubCategory,
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    dispatch(
      getProducts({
        search: searchTerm,
        page: 1,
        limit,
        category: selectedCategory,
        subCategory: selectedSubCategory,
      })
    );
  };

  const handleCategoryClick = (id) => {
    setSelectedCategory(id === selectedCategory ? "" : id);
    setSelectedSubCategory("");
    setCurrentPage(1);
  };

  const handleSubCategoryClick = (id) => {
    setSelectedSubCategory(id === selectedSubCategory ? "" : id);
    setCurrentPage(1);
  };

  // ✅ Logout handler
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const productsArray = product?.products || [];
  const totalPages = product?.totalPages || 1;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex justify-between items-center p-4 bg-[#003f62] shadow-md">
        <div className="flex items-center gap-6">
          <form
            onSubmit={handleSearch}
            className="flex items-center w-64 ml-140 bg-white rounded-full overflow-hidden shadow-sm border border-gray-200"
          >
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-3 py-2 text-gray-700 outline-none text-sm"
            />
            <button className="bg-[#F5A623] hover:bg-[#e79c12] text-white px-4 py-2 rounded-r-full font-medium text-sm">
              Go
            </button>
          </form>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-[#FFBA00] hover:bg-[#FF6C00] text-white px-4 py-2 rounded-lg font-medium transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        <aside className="w-64 bg-white p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-[#003b5c]">Filters</h2>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Category</h3>
            <ul>
              {categories?.map((cat) => (
                <li
                  key={cat._id}
                  className={`cursor-pointer px-2 py-1 rounded mb-1 ${
                    selectedCategory === cat._id
                      ? "bg-[#FFBA00] text-white"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => handleCategoryClick(cat._id)}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">SubCategory</h3>
            <ul>
              {subCategories?.map((sub) => (
                <li
                  key={sub._id}
                  className={`cursor-pointer px-2 py-1 rounded mb-1 ${
                    selectedSubCategory === sub._id
                      ? "bg-[#FFBA00] text-white"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => handleSubCategoryClick(sub._id)}
                >
                  {sub.name}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-[#003b5c]">Products</h2>
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/add-category")}
                className="bg-[#FFBA00] hover:bg-[#FF6C00] text-white px-4 py-2 rounded-lg font-medium"
              >
                Add Category
              </button>
              <button
                onClick={() => navigate("/add-product")}
                className="bg-[#FFBA00] hover:bg-[#FF6C00] text-white px-4 py-2 rounded-lg font-medium"
              >
                Add Product
              </button>
              <button
                onClick={() => navigate("/add-subcategory")}
                className="bg-[#FFBA00] hover:bg-[#FF6C00] text-white px-4 py-2 rounded-lg font-medium"
              >
                Add SubCategory
              </button>
            </div>
          </div>

          {isLoading && <p>Loading products...</p>}
          {isError && <p className="text-red-600">{message}</p>}

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {!isLoading && !isError && productsArray.length > 0 ? (
              productsArray.map((item) => (
                <div
                  key={item._id}
                  className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition cursor-pointer"
                  onClick={() => navigate(`/product/${item._id}`)}
                >
                  <img
                    src={
                      item.images?.[0]
                        ? `http://localhost:3000/${item.images[0]}`
                        : "/placeholder.png"
                    }
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.description}
                    </p>
                    <div className="mt-3 flex justify-between items-center">
                      <button className="bg-[#F5A623] hover:bg-[#e79c12] text-white text-sm px-3 py-1 rounded-full">
                        View
                      </button>
                      <ShoppingCart size={18} className="text-[#003b5c]" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              !isLoading &&
              !isError && <p className="text-gray-600">No products found.</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`px-3 py-1 rounded-full ${
                    currentPage === i + 1
                      ? "bg-[#FFBA00] text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashBoard;
