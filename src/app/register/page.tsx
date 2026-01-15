"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRegister } from "@/hooks/auth/useRegister";
import { useAuthStore } from "@/store/useAuthStore";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, accessToken } = useAuthStore();
  const { formAction, isPending } = useRegister();

  // 토큰이 있으면 이전 페이지로 리다이렉트
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      const redirect = searchParams.get("redirect");
      router.push(redirect || "/");
    }
  }, [isAuthenticated, accessToken, router, searchParams]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">회원가입</h2>
          <p className="mt-2 text-sm text-slate-600">
            간편하게 가입하고 쇼핑을 즐겨보세요.
          </p>
        </div>
        <form className="mt-8 space-y-4" action={formAction}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              아이디
            </label>
            <input
              name="username"
              type="text"
              required
              minLength={4}
              maxLength={50}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-slate-500 focus:border-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              비밀번호
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-slate-500 focus:border-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              비밀번호 확인
            </label>
            <input
              name="confirmPassword"
              type="password"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-slate-500 focus:border-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              이메일
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-slate-500 focus:border-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              휴대폰 번호
            </label>
            <input
              name="phone"
              type="tel"
              required
              placeholder="010-0000-0000"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-slate-500 focus:border-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 mt-8"
          >
            {isPending ? "가입 중..." : "회원가입"}
          </button>
        </form>
      </div>
    </div>
  );
}
