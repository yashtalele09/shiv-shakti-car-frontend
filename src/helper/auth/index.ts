import type { UserT } from "../../typs/auth/sign-up/post";
export const TOKEN_KEY = "user_token";
export const USER_DATA_KEY = "user_data";

/* -------------------------
   Authentication
-------------------------- */

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token;
};

/* -------------------------
   Token
-------------------------- */

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/* -------------------------
   User Data
-------------------------- */

export const getUserData = (): UserT | null => {
  const data = localStorage.getItem(USER_DATA_KEY);
  return data ? JSON.parse(data) : null;
};

export const setUserData = (data: UserT): void => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
};

export const removeUserData = (): void => {
  localStorage.removeItem(USER_DATA_KEY);
};

/* -------------------------
   Clear All Auth
-------------------------- */

export const clearAuth = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};
