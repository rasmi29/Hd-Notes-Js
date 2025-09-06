import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "../types";

const STORAGE_KEY = "hdnotes_auth";

const getStoredAuth = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return { user: null, token: null };
    return JSON.parse(data);
  } catch {
    return { user: null, token: null };
  }
};

const setStoredAuth = (token: string, user: User) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
};

const clearStoredAuth = () => {
  localStorage.removeItem(STORAGE_KEY);
};

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize from localStorage
  const stored = getStoredAuth();
  const [user, setUser] = useState<User | null>(stored.user);
  const [token, setToken] = useState<string | null>(stored.token);
  const [loading, setLoading] = useState(false);

  // Sync with localStorage changes (multi-tab)
  useEffect(() => {
    const sync = () => {
      const { user, token } = getStoredAuth();
      setUser(user);
      setToken(token);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const login = (authToken: string, userData: User, callback?: () => void) => {
    setToken(authToken);
    setUser(userData);
    setStoredAuth(authToken, userData);
    if (callback) callback();
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    clearStoredAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!user,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
