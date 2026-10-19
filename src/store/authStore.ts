import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { showToast } from '../utils/toast';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  expireSession: () => void;
}

const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    // Decode the JWT payload, supporting URL-safe Base64.
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');

    const payload = JSON.parse(
      atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='))
    );

    return typeof payload.exp !== 'number' || Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        if (isTokenExpired(token)) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
          return;
        }

        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });

        showToast.success('Logout successfully');
      },

      expireSession: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',

      onRehydrateStorage: () => (state) => {
        if (!state) return;

        if (!state.token || isTokenExpired(state.token) || !state.user) {
          useAuthStore.setState({
            user: null,
            token: null,
            isAuthenticated: false,
          });
          return;
        }

        useAuthStore.setState({
          isAuthenticated: true,
        });
      },
    }
  )
);

export default useAuthStore;
