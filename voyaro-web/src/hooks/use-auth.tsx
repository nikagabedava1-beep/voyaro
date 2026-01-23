"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { auth as authApi } from "@/lib/api";
import { User, AuthResponse } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, redirectUrl?: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }, redirectUrl?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      authApi
        .me(storedToken)
        .then((userData) => {
          setUser(userData as User);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, redirectUrl?: string) => {
    const response = (await authApi.login({ email, password })) as AuthResponse;
    setUser(response.user);
    setToken(response.accessToken);
    localStorage.setItem("token", response.accessToken);

    // Use redirect URL if provided, otherwise redirect based on role
    if (redirectUrl) {
      router.push(redirectUrl);
    } else if (response.user.role === "PLATFORM_ADMIN") {
      router.push("/admin");
    } else if (response.user.role === "COMPANY_ADMIN") {
      router.push("/company");
    } else {
      router.push("/trips");
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }, redirectUrl?: string) => {
    const response = (await authApi.register(data)) as AuthResponse;
    setUser(response.user);
    setToken(response.accessToken);
    localStorage.setItem("token", response.accessToken);

    // Use redirect URL if provided, otherwise redirect based on role
    if (redirectUrl) {
      router.push(redirectUrl);
    } else if (data.role === "COMPANY_ADMIN") {
      router.push("/register/company");
    } else {
      router.push("/trips");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
