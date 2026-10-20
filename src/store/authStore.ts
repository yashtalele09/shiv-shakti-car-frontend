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

// Returns expiry time in ms, or null if token is invalid
export const getTokenExpiry = (token: string): number | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(
      atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='))
    );

    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const expiry = getTokenExpiry(token);
  return expiry === null || Date.now() >= expiry;
};

let expiryTimer: ReturnType<typeof setTimeout> | null = null;

const clearExpiryTimer = () => {
  if (expiryTimer) {
    clearTimeout(expiryTimer);
    expiryTimer = null;
  }
};

const scheduleExpiry = (token: string, onExpire: () => void) => {
  clearExpiryTimer();

  const expiry = getTokenExpiry(token);
  if (expiry === null) return;

  const delay = expiry - Date.now();
  if (delay <= 0) {
    onExpire();
    return;
  }

  // setTimeout max delay is ~24.8 days (2^31 - 1 ms). Cap it and re-check.
  const MAX_DELAY = 2147483647;
  expiryTimer = setTimeout(
    () => {
      // Re-check in case we capped the delay
      if (isTokenExpired(token)) onExpire();
      else scheduleExpiry(token, onExpire);
    },
    Math.min(delay, MAX_DELAY)
  );
};

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        if (isTokenExpired(token)) {
          set({ user: null, token: null, isAuthenticated: false });
          return;
        }

        set({ user, token, isAuthenticated: true });
        scheduleExpiry(token, () => get().expireSession());
      },

      logout: () => {
        clearExpiryTimer();
        set({ user: null, token: null, isAuthenticated: false });
        showToast.success('Logout successfully');
      },

      expireSession: () => {
        clearExpiryTimer();
        set({ user: null, token: null, isAuthenticated: false });
        showToast.error('Session expired. Please login again.');
      },
    }),
    {
      name: 'auth-storage',

      // Only persist what you need
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),

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

        // Restart the timer after page reload
        scheduleExpiry(state.token, () =>
          useAuthStore.getState().expireSession()
        );
      },
    }
  )
);

export default useAuthStore;
