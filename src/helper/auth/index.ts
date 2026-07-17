import useAuthStore from '../../store/authStore';
import type { AuthUser } from '../../store/authStore';

export const getAuthToken = (): string | null => {
  return useAuthStore.getState().token;
};

export const isAuthenticated = (): boolean => {
  return useAuthStore.getState().isAuthenticated;
};

export const getUserData = (): AuthUser | null => {
  return useAuthStore.getState().user;
};

export const clearAuth = (): void => {
  useAuthStore.getState().logout();
};
