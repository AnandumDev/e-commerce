import axiosIntance from "../../api/axiosInstance"


const login = async (userData) => {
    try {
        const response = await axiosIntance.post('/auth/login', userData)
        if(response.data){
            localStorage.setItem('user', JSON.stringify(response.data))
        }
        return response.data
    } catch (error) {
       const message = error.response?.data?.message || error.message || "Something went wrong"
        throw new Error(message) 
    }
}

const register = async(userData) => {
    try {
        const response = await axiosIntance.post('/auth/register', userData)
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Something went wrong"
        throw new Error(message) 
    }
}

const authService = { login , register }

export default authService