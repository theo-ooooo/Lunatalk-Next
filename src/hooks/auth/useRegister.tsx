"use client";

import { useActionState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";
import { registerAction } from "@/actions/auth";
import { Button } from "@/components/ui/Button";

export function useRegister() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const { openModal, closeModal } = useModalStore();

  const [state, formAction, isPending] = useActionState(registerAction, null);

  useEffect(() => {
    if (state?.success && state?.accessToken) {
      login(state.accessToken);
      openModal({
        title: "회원가입 완료",
        content: (
          <div className="text-center">
            <p>회원가입이 완료되었습니다.</p>
          </div>
        ),
        footer: (
          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              closeModal();
              const redirect = searchParams.get("redirect");
              router.push(redirect || "/");
              router.refresh();
            }}
          >
            확인
          </Button>
        ),
      });
    } else if (state?.error) {
      openModal({
        title: "회원가입 실패",
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
  }, [state, login, router, searchParams, openModal, closeModal]);

  return {
    formAction,
    isPending,
  };
}

