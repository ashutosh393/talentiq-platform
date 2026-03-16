import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Wait for Clerk to be ready
const getClerkToken = async () => {
  // Wait up to 3 seconds for Clerk to initialize
  let attempts = 0;
  while (!window.Clerk?.session && attempts < 30) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    attempts++;
  }
  return await window.Clerk?.session?.getToken();
};

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await getClerkToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn("No Clerk token available");
      }
    } catch (error) {
      console.error("Failed to get Clerk token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;