import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import type { User } from "../types/domain";

interface AuthState {
  user: User | null;
  token: string | null;
  remember: boolean;
  login: (user: User, token: string, remember: boolean) => void;
  logout: () => void;
}

const authStorage: StateStorage = {
  getItem: (name) => localStorage.getItem(name) ?? sessionStorage.getItem(name),
  setItem: (name, value) => {
    const persisted = JSON.parse(value) as { state?: { remember?: boolean } };
    const destination = persisted.state?.remember ? localStorage : sessionStorage;
    const staleStorage = persisted.state?.remember ? sessionStorage : localStorage;
    destination.setItem(name, value);
    staleStorage.removeItem(name);
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      remember: false,
      login: (user, token, remember) => set({ user, token, remember }),
      logout: () => set({ user: null, token: null, remember: false })
    }),
    {
      name: "eventflow-auth",
      storage: createJSONStorage(() => authStorage)
    }
  )
);
