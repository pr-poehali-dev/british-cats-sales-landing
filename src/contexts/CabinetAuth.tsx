import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, clearToken, getToken, setToken, type Me } from '@/lib/cabinet-api';

interface Ctx {
  me: Me | null;
  loading: boolean;
  applyToken: (token: string) => Promise<Me>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const CabinetCtx = createContext<Ctx | null>(null);

export const CabinetAuthProvider = ({ children }: { children: ReactNode }) => {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setMe(null);
      setLoading(false);
      return;
    }
    try {
      setMe(await api.me());
    } catch {
      clearToken();
      setMe(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const applyToken = useCallback(async (token: string) => {
    setToken(token);
    const fresh = await api.me();
    setMe(fresh);
    return fresh;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      /* сессия уже недействительна */
    }
    clearToken();
    setMe(null);
  }, []);

  return (
    <CabinetCtx.Provider value={{ me, loading, applyToken, logout, refresh }}>
      {children}
    </CabinetCtx.Provider>
  );
};

export const useCabinet = () => {
  const ctx = useContext(CabinetCtx);
  if (!ctx) throw new Error('useCabinet должен использоваться внутри CabinetAuthProvider');
  return ctx;
};