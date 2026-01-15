import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (accessToken: string, refreshToken?: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      login: (accessToken: string, refreshToken?: string | null) => {
        localStorage.setItem("accessToken", accessToken);
        if (typeof refreshToken === "string") {
          localStorage.setItem("refreshToken", refreshToken);
        }
        set({
          isAuthenticated: true,
          accessToken,
          refreshToken: typeof refreshToken === "string" ? refreshToken : null,
        });
      },
      logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({ isAuthenticated: false, accessToken: null, refreshToken: null });
      },
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) return;
        if (typeof window === "undefined") return;

        // source of truth: localStorage의 실제 토큰 키
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        // accessToken 키가 없으면 UI가 "로그인됨"으로 남지 않게 강제 로그아웃
        if (!accessToken) {
          state.logout();
          return;
        }

        // localStorage와 store 값을 동기화
        state.login(accessToken, refreshToken ?? null);
      },
    }
  )
);
