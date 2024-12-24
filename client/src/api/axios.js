import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export default axios.create({
    baseURL: BASE_URL
})

//this private axios that we are working with JSON web tokens
export const privateAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true,
})