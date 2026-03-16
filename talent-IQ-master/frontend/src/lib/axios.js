import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Add Clerk token interceptor - access Clerk instance directly
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Failed to get Clerk token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;