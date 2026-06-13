// Pure frontend useAuth — reads from localStorage, no tRPC / no backend needed.
import { useState, useCallback, useMemo, useEffect } from "react";
import { getStoredUser, loginUser, logoutUser, type MockUser } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Read the stored session on mount
    setUser(getStoredUser());
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const u = await loginUser(email, password);
      setUser(u);
      return u;
    } catch (err) {
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
    window.location.href = "/backoffice/login";
  }, []);

  return useMemo(
    () => {
      const role = user?.role?.toLowerCase() || "";
      const isProprio = role === "propriétaire" || role === "superadmin" || !!user?.is_superuser;
      const isAdmin = isProprio || role === "admin" || role === "administrateur";
      const isEditor = isAdmin || role === "éditeur";

      return {
        user,
        isAuthenticated: !!user,
        isProprio,
        isSuperadmin: isProprio,
        isAdmin,
        isEditor,
        isViewer: role === "client",
        isLoading,
        error: null,
        login,
        logout,
        refresh: () => setUser(getStoredUser()),
      };
    },
    [user, isLoading, login, logout],
  );
}
