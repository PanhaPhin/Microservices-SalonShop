import axios from "axios";

export const API_BASE_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    let token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("jwt");

    if (token) {
      token = token.replace(/^Bearer\s+/i, "");
      token = token.replace(/^"(.*)"$/, "$1");

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      console.error("401: JWT missing, invalid, or expired");
    }

    if (error.response?.status === 403) {
      console.error("403: User does not have permission");
    }

    return Promise.reject(error);
  }
);

export default api;