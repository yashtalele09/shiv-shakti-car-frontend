import axios, { AxiosError } from "axios";
import type { AxiosInstance } from "axios";
import { toast } from "react-toastify";

// import authService from "./lib/services/auth-service";
import { useLoaderStore } from "./stores/useLoaderStore";
import type { APIFailureData } from "./types/shared";
import { TOKEN_KEY } from "./helper/auth";

const baseURL = import.meta.env.VITE_APP_API_URL;
// Instance for APIs that require a token
const authInstance: AxiosInstance = axios.create({
  baseURL,
});

authInstance.interceptors.request.use(
  (config) => {
    useLoaderStore.getState().incrementLoading();
    const token = localStorage.getItem(TOKEN_KEY); // or get the token from a secure place
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    useLoaderStore.getState().decrementLoading();
    return Promise.reject(error);
  },
);

authInstance.interceptors.response.use(
  (res) => {
    useLoaderStore.getState().decrementLoading();
    return res;
  },
  (error: AxiosError<APIFailureData>) => {
    useLoaderStore.getState().decrementLoading();

    // Handle network errors (no response from server)
    if (!error.response) {
      toast.error(
        error.message || "Network error. Please check your connection.",
      );
      return Promise.reject(error);
    }

    const status = error.response.status;
    // const errorData = error.response?.data || {};

    // Handle 401 Unauthorized - session expired
    // if (status === 401) {
    //   authService.logout();
    //   toast.error(errorData.message || "Session expired. Please login again.");
    //   return Promise.reject(error);
    // }

    // Handle 403 Forbidden
    if (status === 403) {
      toast.error("You don't have permission to perform this action.");
      return Promise.reject(error);
    }

    // Handle 404 Not Found
    if (status === 404) {
      return Promise.reject(error);
    }

    // Handle 422 Validation errors - might want to handle differently
    if (status === 422) {
      return Promise.reject(error);
    }

    // Handle 500+ Server errors
    if (status >= 500) {
      return Promise.reject(error);
    }

    // Handle other client errors (4xx)

    return Promise.reject(error);
  },
);

// Instance for APIs that don't require a token
const instance: AxiosInstance = axios.create({
  baseURL,
});

instance.interceptors.request.use(
  (config) => {
    useLoaderStore.getState().incrementLoading();
    return config;
  },
  (error) => {
    useLoaderStore.getState().decrementLoading();
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (res) => {
    useLoaderStore.getState().decrementLoading();
    return res;
  },
  (error: AxiosError<APIFailureData>) => {
    useLoaderStore.getState().decrementLoading();

    // Handle network errors (no response from server)
    if (!error.response) {
      toast.error(
        error.message || "Network error. Please check your connection.",
      );
      return Promise.reject(error);
    }

    const status = error.response.status;

    // Handle 401 Unauthorized
    if (status === 401) {
      return Promise.reject(error);
    }

    // Handle 403 Forbidden
    if (status === 403) {
      return Promise.reject(error);
    }

    // Handle 404 Not Found
    if (status === 404) {
      return Promise.reject(error);
    }

    // Handle 422 Validation errors
    if (status === 422) {
      return Promise.reject(error);
    }

    // Handle 500+ Server errors
    if (status >= 500) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export { authInstance, instance };

export default { authInstance, instance };
