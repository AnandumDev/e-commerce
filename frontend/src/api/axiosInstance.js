import axios from "axios";

const axiosIntance = axios.create({
    baseURL: 'https://e-commerce-3-m9ad.onrender.com/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

export default axiosIntance
