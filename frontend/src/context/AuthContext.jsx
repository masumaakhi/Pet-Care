import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/auth/me");
      setUser(res.data.data);
    } catch (error) {
      // Only remove token if it's explicitly an auth error (401/403)
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem("token");
        setUser(null);
      } else {
        console.warn("Network or server error during fetchMe. Keeping session data.");
        // Fallback user if backend unreachable completely? For now we just keep token.
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, [fetchMe]);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
    setLoading(false);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // ignore logout API error
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        logout,
        fetchMe,
        isAuthed: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}