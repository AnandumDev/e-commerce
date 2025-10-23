import axiosInstance from "../../api/axiosInstance";

const addCategory = async (categoryData) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.token) {
      throw new Error("No token found. Please login again.");
    }
    const token = user.token;

    const response = await axiosInstance.post(
      "/auth/addCategory",
      categoryData,
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

const categoryService = { addCategory };
export default categoryService;
