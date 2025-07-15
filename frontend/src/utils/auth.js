import { useState, useEffect } from "react";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const userString =
        sessionStorage.getItem("user") || localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const token = user && user.token ? user.token : null;
      setIsLoggedIn(!!token);
    };

    // Listen for storage changes (cross-tab)
    window.addEventListener("storage", checkAuth);
    // Listen for custom event (same tab)
    window.addEventListener("authChanged", checkAuth);

    // Initial check
    checkAuth();

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChanged", checkAuth);
    };
  }, []);

  return { isLoggedIn };
}
