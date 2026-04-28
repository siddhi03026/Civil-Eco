import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  city?: string;
  state?: string;
  country?: string;
  areaType?: "urban" | "rural";
  area?: "Urban" | "Rural";
  role: "user" | "admin";
  settings?: {
    language: "Hindi" | "English";
    voiceEnabled: boolean;
    notifications: boolean;
  };
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    mobile?: string;
    city?: string;
    state?: string;
    country?: string;
    areaType?: "urban" | "rural";
    role: "user" | "admin";
    settings?: {
      language: "Hindi" | "English";
      voiceEnabled: boolean;
      notifications: boolean;
    };
  };
}

const USER_KEY = "eco_user";
const TOKEN_KEY = "eco_token";

function normalizeUser(user: AuthResponse["user"]): AppUser {
  return {
    ...user,
    area: user.areaType === "rural" ? "Rural" : "Urban",
  };
}

export function getUser(): AppUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AppUser) : null;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setUser(u: AppUser | null, token?: string | null) {
  if (typeof window === "undefined") return;
  if (u) {
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    if (token) localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }
  window.dispatchEvent(new Event("eco-auth"));
}

export async function loginUser(email: string, password: string) {
  const data = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  const user = normalizeUser(data.user);
  setUser(user, data.token);
  return user;
}

export async function registerUser(payload: {
  name: string;
  email: string;
  mobile: string;
  city: string;
  state: string;
  country: string;
  areaType: "urban" | "rural";
  password: string;
}) {
  const data = await apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: payload,
  });
  const user = normalizeUser(data.user);
  setUser(user, data.token);
  return user;
}

export function useAuth() {
  const [user, setLocal] = useState<AppUser | null>(null);
  useEffect(() => {
    setLocal(getUser());
    const onChange = () => setLocal(getUser());
    window.addEventListener("eco-auth", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("eco-auth", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return { user, token: getToken(), setUser, logout: () => setUser(null) };
}
