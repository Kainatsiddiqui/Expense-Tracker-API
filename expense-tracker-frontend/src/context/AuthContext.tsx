import { createContext, useContext, useState, useEffect } from "react";
import type { UserProfile } from "../types/user";
import { getProfile } from "../services/userService";

type AuthContextType = {
  token: string | null;
  user: UserProfile | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeAuth() {
      const savedToken =
        localStorage.getItem("token");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      setToken(savedToken);

      try {
        const profile =
          await getProfile();

        setUser(profile);
      } catch {
        localStorage.removeItem(
          "token"
        );
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    initializeAuth();
  }, []);

  useEffect(() => {
    if (token) {
      refreshUser();
    }
  }, [token]);

  async function refreshUser() {
    try {
      const profile =
        await getProfile();

      setUser(profile);
    } catch {
      setUser(null);
    }
  }
  
  async function login(
    token: string
  ) {
    localStorage.setItem(
      "token",
      token
    );

    setToken(token);

    try {
      const profile =
        await getProfile();

      setUser(profile);
    } catch {
      setUser(null);
    }
  }

  function logout() {
    localStorage.removeItem(
      "token"
    );

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
    value={{
      loading,
      token,
      user,
      login,
      logout,
      refreshUser,
    }}
  >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
      throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
  }