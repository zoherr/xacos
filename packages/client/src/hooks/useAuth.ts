import { useState, useEffect, useCallback } from 'react';
import type { XUser } from '@xacos/shared';
import { xhttp } from '../http/XHttpClient';

interface UseAuthResult {
  user: XUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  login: (credentials: Record<string, unknown>) => Promise<void>;
  register: (credentials: Record<string, unknown>) => Promise<void>;
}


/**
 * Hook to manage authentication state and user profile.
 * Relies on secure cookies (set by server) and XHttpClient.
 */
export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<XUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const data = await xhttp.get<{ user: XUser }>('/api/auth/me');
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMe();
  }, [fetchMe]);

  const login = useCallback(async (credentials: Record<string, unknown>) => {
    setLoading(true);
    try {
      await xhttp.post('/api/auth/login', credentials);
      await fetchMe();
    } catch (e) {
      setLoading(false);
      throw e;
    }
  }, [fetchMe]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await xhttp.post('/api/auth/logout');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (credentials: Record<string, unknown>) => {
    setLoading(true);
    try {
      await xhttp.post('/api/auth/register', credentials);
      await fetchMe();
    } catch (e) {
      setLoading(false);
      throw e;
    }
  }, [fetchMe]);

  return { user, loading, logout, login, register };
}


