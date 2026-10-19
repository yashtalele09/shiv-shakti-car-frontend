import { showToast } from '../../utils/toast';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

    const payload = JSON.parse(atob(parts[1]));

    return typeof payload.exp !== 'number' || Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

const clearSession = (set: (state: Partial<AuthState>) => void) => {
  set({
    user: null,
    token: null,
    isAuthenticated: false,
  });
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        if (isTokenExpired(token)) {
          clearSession(set);
          return;
        }

        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        clearSession(set);
        showToast.success('Logout successfully');
      },

      expireSession: () => {
        clearSession(set);
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

        useAuthStore.setState({ isAuthenticated: true });
      },
    }
  )
);

export default useAuthStore;
