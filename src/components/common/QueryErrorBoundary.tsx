"use client";

import { ErrorBoundary } from "react-error-boundary";
import { Error } from "./Error";

interface QueryErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  // 401/403 에러인 경우 로그인 페이지로 리다이렉트
  if (
    typeof window !== "undefined" &&
    ((error as any).status === 401 || (error as any).status === 403)
  ) {
    if (
      error.message === "인증이 필요합니다." ||
      error.message.includes("인증")
    ) {
      return (
        <Error
          message="로그인이 필요합니다."
          actionLabel="로그인하기"
          actionHref="/login"
        />
      );
    }
  }

  return (
    <Error
      message={error.message || "정보를 불러오는 중 오류가 발생했습니다."}
      actionLabel="홈으로 돌아가기"
      actionHref="/"
    />
  );
}

export function QueryErrorBoundary({
  children,
  fallback,
}: QueryErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={fallback ? () => <>{fallback}</> : ErrorFallback}
      onError={(error) => {
        console.error("QueryErrorBoundary caught an error:", error);
        // 401/403 에러인 경우 로그인 페이지로 리다이렉트
        if (
          typeof window !== "undefined" &&
          ((error as any).status === 401 || (error as any).status === 403)
        ) {
          if (
            error.message === "인증이 필요합니다." ||
            error.message.includes("인증")
          ) {
            setTimeout(() => {
              window.location.href = "/login";
            }, 100);
          }
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
