"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/services/api";

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const { openModal, closeModal } = useModalStore();
  const [isPending, setIsPending] = useState(false);

  const handleLogin = async (username: string, password: string) => {
    if (!username || !password) {
      openModal({
        title: "로그인 실패",
        content: (
          <div className="text-center">
            <p>아이디와 비밀번호를 입력해주세요.</p>
          </div>
        ),
        footer: (
          <Button variant="primary" fullWidth onClick={closeModal}>
            확인
          </Button>
        ),
      });
      return;
    }

    setIsPending(true);
    try {
      const response = await authApi.login({ username, password });

      if (response.accessToken) {
        login(response.accessToken);
        const redirect = searchParams.get("redirect");
        router.push(redirect || "/");
        router.refresh();
      } else {
        throw new Error("로그인에 실패했습니다.");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.";

      openModal({
        title: "로그인 실패",
        content: (
          <div className="text-center">
            <p>{errorMessage}</p>
          </div>
        ),
        footer: (
          <Button variant="primary" fullWidth onClick={closeModal}>
            확인
          </Button>
        ),
      });
    } finally {
      setIsPending(false);
    }
  };

  return {
    handleLogin,
    isPending,
  };
}
