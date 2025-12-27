import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, loginForToken, registerUser, logoutUser, saveToken } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("anime_token") || "");
  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState("");

  useEffect(() => {
    const hydrate = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setError("");
        const current = await getCurrentUser();
        setUser(current);
      } catch (err) {
        setError(err.message || "دانیشتن بەسەرچوو");
        saveToken("");
        setToken("");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    hydrate();
  }, [token]);

  const login = async (email, password) => {
    try {
      setError("");
      const res = await loginForToken(email, password);
      saveToken(res.token);
      setToken(res.token);
      setUser(res.user || null);
      return res.user;
    } catch (err) {
      setError(err.message || "چوونەژوورەوە سەرکەوتوو نەبوو");
      throw err;
    }
  };

  const signup = async (payload) => {
    try {
      setError("");
      const res = await registerUser(payload);
      saveToken(res.token);
      setToken(res.token);
      setUser(res.user || null);
      return res.user;
    } catch (err) {
      setError(err.message || "تۆمارکردن سەرکەوتوو نەبوو");
      throw err;
    }
  };

  const logout = () => {
    setError("");
    if (token) {
      logoutUser().catch(() => {
        // Ignore logout errors to allow local sign out.
      });
    }
    saveToken("");
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      login,
      signup,
      logout,
      setUser,
    }),
    [user, token, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
