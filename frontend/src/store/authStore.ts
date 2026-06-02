import { create } from "zustand";
import { authApi } from "../api/auth.api";
import type { User } from "../types";

interface AuthState {
  token: string | null;
  user: User | null;
  hydrated: boolean;
  hydrate: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  hydrated: false,

  hydrate: () => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? (JSON.parse(userRaw) as User) : null;
    set({ token, user, hydrated: true });
  },

  login: async (email, password) => {
    const { data } = await authApi.login({ email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    set({ token: data.token, user: data.user });
  },

  register: async (name, email, password) => {
    await authApi.register({ name, email, password });
    const { data } = await authApi.login({ email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    set({ token: data.token, user: data.user });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null });
  },
}));
