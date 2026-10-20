import { useEffect } from 'react';
import useAuthStore, { isTokenExpired } from '../store/authStore';

const useSessionWatcher = (): void => {
  useEffect(() => {
    const check = () => {
      const { token, expireSession } = useAuthStore.getState();
      if (token && isTokenExpired(token)) {
        expireSession();
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') check();
    };

    // Check immediately on mount
    check();

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', check);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', check);
    };
  }, []);
};

export default useSessionWatcher;
