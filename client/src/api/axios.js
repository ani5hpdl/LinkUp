import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRefresh = originalRequest?.url?.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRefresh &&
      !originalRequest.skipAuthRefresh
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh", {}, { skipAuthRefresh: true });
        return api(originalRequest);
      } catch (refreshError) {
        sessionStorage.removeItem("refreshToken");
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401) {
      sessionStorage.removeItem("refreshToken");
    }

    return Promise.reject(error);
  }
);

export default api;
