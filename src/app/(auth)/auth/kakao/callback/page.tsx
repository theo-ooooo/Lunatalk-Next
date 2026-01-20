"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useKakaoLogin } from "@/hooks/auth/useKakaoLogin";
import { Loading } from "@/components/common/Loading";

function KakaoCallbackContent() {
  const searchParams = useSearchParams();
  const { handleKakaoCallback } = useKakaoLogin();

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      // 사용자가 카카오 로그인을 취소한 경우
      window.location.href = "/login";
      return;
    }

    if (code) {
      handleKakaoCallback(code);
    } else {
      window.location.href = "/login";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <Loading message="카카오 로그인 처리 중..." />
    </div>
  );
}

export default function KakaoCallbackPage() {
  return (
    <Suspense fallback={<Loading message="로딩 중..." />}>
      <KakaoCallbackContent />
    </Suspense>
  );
}
