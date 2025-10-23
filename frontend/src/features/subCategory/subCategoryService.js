import axiosIntance from "../../api/axiosInstance";

export const addSubCategory = async (subCategoryData) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.token) {
      throw new Error("No token found. Please login again.");
    }

    const token = user.token;

    const response = await axiosIntance.post(
      "/auth/addSubcategory",
      subCategoryData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Unknown error";
    throw new Error(`Error in categoryService: ${message}`);
  }
};

export const getSubCategories = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.token) {
      throw new Error("No token provided");
    }

    const token = user.token;

    const response = await axiosIntance.get("/auth/subcategories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Unknown error";
    throw new Error(`Error in getSubcategoryService: ${message}`);
  }
};

const subCategoryService = { addSubCategory, getSubCategories };
export default subCategoryService;
