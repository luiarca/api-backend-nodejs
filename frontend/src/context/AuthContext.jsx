import { createContext, useEffect, useState } from "react";
import { loginRequest } from "../services/authService";

const STORAGE_KEY = "inventario_auth";

export const AuthContext = createContext(null);

function getStoredSession() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return { token: null, user: null };
    }

    const parsed = JSON.parse(stored);

    if (!parsed?.token || !parsed?.user?.rol) {
      return { token: null, user: null };
    }

    return parsed;
  } catch (error) {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getStoredSession);

  useEffect(() => {
    if (!session.token || !session.user) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  const login = async (credentials) => {
    const data = await loginRequest(credentials);
    setSession({
      token: data.token,
      user: data.usuario
    });
    return data;
  };

  const logout = () => {
    setSession({ token: null, user: null });
  };

  return (
    <AuthContext.Provider
      value={{
        token: session.token,
        user: session.user,
        isAuthenticated: Boolean(session.token),
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
