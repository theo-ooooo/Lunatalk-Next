"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";
import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/Button";

export function useLogin() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { openModal, closeModal } = useModalStore();

  const [state, formAction, isPending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state?.success && state?.accessToken) {
      login(state.accessToken);
      router.push("/");
      router.refresh();
    } else if (state?.error) {
      openModal({
        title: "로그인 실패",
        content: (
          <div className="text-center">
            <p>{state.error}</p>
          </div>
        ),
        footer: (
          <Button variant="primary" fullWidth onClick={closeModal}>
            확인
          </Button>
        ),
      });
    }
  }, [state, login, router, openModal, closeModal]);

  return {
    formAction,
    isPending,
  };
}
