import axios from "axios";
import { getToken } from "../services/storage";

// Use your computer's network IP address
export const API_URL = "https://be-sekre.msdm.app/api"; // Replace with your IP address
// export const API_URL = "http://localhost:5200/api"; // Replace with your IP address

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Add a request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
