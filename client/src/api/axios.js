import axios from "axios";

const BASE_URL = "https://performance-71pc.onrender.com/api";
// http://localhost:5000
// https://performance-71pc.onrender.com

export default axios.create({
  baseURL: BASE_URL,
});

//this private axios that we are working with JSON web tokens
export const privateAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
