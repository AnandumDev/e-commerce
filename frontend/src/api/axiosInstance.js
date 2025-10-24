import axios from "axios";

const axiosIntance = axios.create({
    baseURL: 'https://e-commerce-7-sg0k.onrender.com/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

export default axiosIntance
