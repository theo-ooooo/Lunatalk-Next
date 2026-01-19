import { Suspense } from "react";
import RegisterPageClient from "./RegisterPageClient";
import type { Metadata } from "next";

// Production 환경에서만 SEO 메타데이터 적용 (회원가입 페이지는 항상 noindex)
const isProduction = process.env.NODE_ENV === "production";

export const metadata: Metadata = {
  title: "회원가입",
  description: isProduction
    ? "루나톡에 회원가입하여 다양한 상품을 만나보세요."
    : "회원가입",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-4rem)] bg-white" />}>
      <RegisterPageClient />
    </Suspense>
  );
}


