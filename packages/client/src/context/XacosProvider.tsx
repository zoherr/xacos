import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { XUser } from '@xacos/shared';

interface XacosContextValue {
  user: XUser | null;
  loading: boolean;
  setUser: (user: XUser | null) => void;
}

const XacosContext = createContext<XacosContextValue | null>(null);

/**
 * Global provider for XAOCS client state (auth, config, etc.).
 * Relies on secure cookies for authentication state.
 */
export function XacosProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<XUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial load logic removed from here as useAuth handles it via API
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <XacosContext.Provider value={{ user, loading, setUser }}>
      {children}
    </XacosContext.Provider>
  );
}

/**
 * Access the global XAOCS context.
 */
export function useXacosContext(): XacosContextValue {
  const ctx = useContext(XacosContext);
  if (!ctx) throw new Error('[XAOCS] useXacosContext must be used inside <XacosProvider>');
  return ctx;
}

