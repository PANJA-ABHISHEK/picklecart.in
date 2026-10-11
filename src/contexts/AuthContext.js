"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if they already logged in during this session
    const isAuth = sessionStorage.getItem("picklecart_admin_auth");
    if (isAuth === "true") {
      setUser({ username: "Admin" });
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // Simple, non-complex hardcoded login for the team
    if (username.toLowerCase() === "admin" && password === "picklecart") {
      sessionStorage.setItem("picklecart_admin_auth", "true");
      setUser({ username: "Admin" });
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem("picklecart_admin_auth");
    setUser(null);
    router.push("/admin/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
