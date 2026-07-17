import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
import { toast } from 'react-toastify';

import { useLoaderStore } from './stores/useLoaderStore';
import type { APIFailureData } from './typs/shared';
import { getAuthToken } from './helper/auth'; // ← changed: removed TOKEN_KEY, added getAuthToken

const baseURL = import.meta.env.VITE_APP_API_URL;

// Instance for APIs that require a token
const authInstance: AxiosInstance = axios.create({
  baseURL,
});

authInstance.interceptors.request.use(
  (config) => {
    useLoaderStore.getState().incrementLoading();
    const token = getAuthToken(); // ← changed: use helper instead of localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    useLoaderStore.getState().decrementLoading();
    return Promise.reject(error);
  }
);

authInstance.interceptors.response.use(
  (res) => {
    useLoaderStore.getState().decrementLoading();
    return res;
  },
  (error: AxiosError<APIFailureData>) => {
    useLoaderStore.getState().decrementLoading();

    if (!error.response) {
      toast.error(
        error.message || 'Network error. Please check your connection.'
      );
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (status === 403) {
      toast.error("You don't have permission to perform this action.");
      return Promise.reject(error);
    }

    if (status === 404) {
      return Promise.reject(error);
    }

    if (status === 422) {
      return Promise.reject(error);
    }

    if (status >= 500) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
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
  }
);

instance.interceptors.response.use(
  (res) => {
    useLoaderStore.getState().decrementLoading();
    return res;
  },
  (error: AxiosError<APIFailureData>) => {
    useLoaderStore.getState().decrementLoading();

    if (!error.response) {
      toast.error(
        error.message || 'Network error. Please check your connection.'
      );
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (status === 401) {
      return Promise.reject(error);
    }

    if (status === 403) {
      return Promise.reject(error);
    }

    if (status === 404) {
      return Promise.reject(error);
    }

    if (status === 422) {
      return Promise.reject(error);
    }

    if (status >= 500) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export { authInstance, instance };

export default { authInstance, instance };
