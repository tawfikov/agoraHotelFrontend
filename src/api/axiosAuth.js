import axios from "axios";

export const axiosAuth = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
})