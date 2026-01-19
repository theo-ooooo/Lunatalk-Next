import { Suspense } from "react";
import LoginPageClient from "./LoginPageClient";
import type { Metadata } from "next";

// Production 환경에서만 SEO 메타데이터 적용 (로그인 페이지는 항상 noindex)
const isProduction = process.env.NODE_ENV === "production";

export const metadata: Metadata = {
  title: "로그인",
  description: isProduction
    ? "루나톡에 로그인하여 다양한 상품을 만나보세요."
    : "로그인",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-4rem)] bg-white" />}>
      <LoginPageClient />
    </Suspense>
  );
}


