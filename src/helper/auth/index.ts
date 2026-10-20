import useAuthStore, { isTokenExpired } from '../../store/authStore';
import type { AuthUser } from '../../store/authStore';

export const getAuthToken = (): string | null => {
  const { token, expireSession } = useAuthStore.getState();

  if (token && isTokenExpired(token)) {
    expireSession(); // removes it from the store + localStorage
    return null;
  }

  return token;
};

export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

export const getUserData = (): AuthUser | null => {
  // Make sure expired sessions are cleaned up first
  getAuthToken();
  return useAuthStore.getState().user;
};

export const clearAuth = (): void => {
  useAuthStore.getState().logout();
};
