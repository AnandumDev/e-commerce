import axiosIntance from "../../api/axiosInstance"

const addproduct = async (productData) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'))

        if(!user?.token){
            throw new Error('No token provided')
        }

        const token = user.token
        console.log("Sending product data:", productData);
        
        const response = await axiosIntance.post("/auth/addproduct", productData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            }
        })
        
        console.log("Product added successfully:", response.data);
        return response.data
    } catch (error) {
        console.error("Error adding product:", error);
        const message = error.response?.data?.message || error.message || 'Something went wrong'
        throw new Error(message)
    }
}

const getProducts = async (search = "", page = 1, limit = 10, category = "", subCategory = "") => {
    try {
        const user = JSON.parse(localStorage.getItem('user'))
        if (!user?.token) {
            throw new Error('No token Provided')
        }

        const token = user.token
        console.log("Fetching products with filters:", { search, page, limit, category, subCategory });

        const response = await axiosIntance.get('/auth/getproducts', {
            params: { 
                search, 
                page, 
                limit,
                category,  
                subCategory 
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        
        console.log("Products fetched successfully:", response.data);
        return response.data
    } catch (error) {
        console.error("Error fetching products:", error);
        const message = error.response?.data?.message || error.message || 'Something went wrong'
        throw new Error(message)
    }
}


const getProductDetails = async (id) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.token) throw new Error('No token provided');

    const response = await axiosIntance.get(`/auth/productdetails/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    });

    return response.data.product;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    throw new Error(message);
  }
};


const updateProduct = async (id, productData) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.token) throw new Error('No token provided');

    const response = await axiosIntance.put(`/auth/updateproduct/${id}`, productData, {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    throw new Error(message);
  }
};






const productService =  { addproduct, getProducts, getProductDetails, updateProduct } 
export default productService