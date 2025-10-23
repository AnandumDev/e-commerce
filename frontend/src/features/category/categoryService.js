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


const getCategory = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'))

    if(!user?.token){
       throw new Error('No token found. Please login again.')
    }

    const token = user.token

    const response = await axiosInstance.get('/auth/getCategories', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw new Error(error.message)
  }
}

const categoryService = { addCategory, getCategory };
export default categoryService;
