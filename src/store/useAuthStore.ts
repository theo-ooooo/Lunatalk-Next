import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      accessToken: null,
      login: (token: string) => {
        localStorage.setItem("accessToken", token);
        set({ isAuthenticated: true, accessToken: token });
      },
      logout: () => {
        localStorage.removeItem("accessToken");
        set({ isAuthenticated: false, accessToken: null });
      },
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
      }),
    }
  )
);
