import { createContext, useEffect, useMemo, useState } from "react";
import { fetchCurrentUser, loginUser, registerUser } from "../api/auth.js";

export const AuthContext = createContext(null);

const STORAGE_KEY = "wheelcheck-auth";

function loadStoredAuth() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [{ token, user }, setAuthState] = useState(loadStoredAuth);
  const [isHydrating, setIsHydrating] = useState(Boolean(token));

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
  }, [token, user]);

  useEffect(() => {
    let isMounted = true;

    async function hydrateUser() {
      if (!token) {
        setIsHydrating(false);
        return;
      }

      try {
        const response = await fetchCurrentUser(token);
        if (isMounted) {
          setAuthState((previous) => ({ ...previous, user: response.user }));
        }
      } catch {
        if (isMounted) {
          setAuthState({ token: null, user: null });
        }
      } finally {
        if (isMounted) {
          setIsHydrating(false);
        }
      }
    }

    hydrateUser();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isHydrating,
      async login(credentials) {
        const response = await loginUser(credentials);
        setAuthState(response);
        return response;
      },
      async register(payload) {
        const response = await registerUser(payload);
        setAuthState(response);
        return response;
      },
      logout() {
        setAuthState({ token: null, user: null });
      }
    }),
    [token, user, isHydrating]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

