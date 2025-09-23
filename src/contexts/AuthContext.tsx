// src/context/AuthContext.tsx
import React, { createContext, useEffect, useState } from "react";
import { authApi, authService } from "../api/auth";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // try refresh on startup
    (async () => {
      try {
        const token = await authApi.refresh();
        if (token) {
          const me = await authApi.me();
          setUser(me.data);
        }
      } catch (e) {
        authService.clearAccessToken();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const { user } = await authApi.login(email, password);
    setUser(user);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
