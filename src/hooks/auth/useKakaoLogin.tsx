"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/services/api";

export function useKakaoLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const { openModal, closeModal } = useModalStore();

  const handleKakaoLogin = () => {
    const kakaoClientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    if (!kakaoClientId) {
      openModal({
        title: "오류",
        content: (
          <div className="text-center">
            <p>카카오 로그인 설정이 되어있지 않습니다.</p>
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

    const redirectUri = `${window.location.origin}/auth/kakao/callback`;
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code`;

    window.location.href = kakaoAuthUrl;
  };

  const handleKakaoCallback = async (code: string) => {
    try {
      const response = await authApi.kakaoLogin(code);

      if (response.accessToken) {
        login(response.accessToken, response.refreshToken);
        const redirect = searchParams.get("redirect");
        router.push(redirect || "/");
        router.refresh();
      } else {
        throw new Error("카카오 로그인에 실패했습니다.");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "카카오 로그인에 실패했습니다.";

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
    }
  };

  return {
    handleKakaoLogin,
    handleKakaoCallback,
  };
}
