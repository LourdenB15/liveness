import { useEffect, useState } from "react";
import { api } from "../services/api";

export function useCurrentUser() {
  const [user, setUser] = useState(() => api.auth.getCurrentUser());
  const [loading, setLoading] = useState(() => !api.auth.isInitialized());

  useEffect(() => {
    let mounted = true;
    api.auth.init().then((currentUser) => {
      if (mounted) {
        setUser(currentUser);
        setLoading(false);
      }
    });

    const handleAuthChange = () => {
      setUser(api.auth.getCurrentUser());
      setLoading(false);
    };
    window.addEventListener("auth:expired", handleAuthChange);
    window.addEventListener("auth:logout", handleAuthChange);
    window.addEventListener("auth:login", handleAuthChange);
    window.addEventListener("auth:user_updated", handleAuthChange);
    return () => {
      mounted = false;
      window.removeEventListener("auth:expired", handleAuthChange);
      window.removeEventListener("auth:logout", handleAuthChange);
      window.removeEventListener("auth:login", handleAuthChange);
      window.removeEventListener("auth:user_updated", handleAuthChange);
    };
  }, []);

  return { user, loading };
}
