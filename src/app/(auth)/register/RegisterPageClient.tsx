"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRegister } from "@/hooks/auth/useRegister";
import { useAuthStore } from "@/store/useAuthStore";
import AuthTabs from "@/components/auth/AuthTabs";

export default function RegisterPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, accessToken } = useAuthStore();
  const { formAction, isPending } = useRegister();

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      const redirect = searchParams.get("redirect");
      router.push(redirect || "/");
    }
  }, [isAuthenticated, accessToken, router, searchParams]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="pb-4 mb-6 border-b border-slate-100">
          <h1 className="text-[18px] md:text-[22px] font-extrabold text-slate-900">
            로그인/회원가입
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            회원가입 후 바로 쇼핑을 시작할 수 있어요.
          </p>
        </div>

        <AuthTabs />

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <form className="space-y-3" action={formAction}>
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
                className="w-full h-11 px-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-0 focus:border-slate-900"
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
                className="w-full h-11 px-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-0 focus:border-slate-900"
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
                className="w-full h-11 px-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-0 focus:border-slate-900"
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
                className="w-full h-11 px-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-0 focus:border-slate-900"
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
                className="w-full h-11 px-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-0 focus:border-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center h-11 items-center px-4 border border-transparent rounded-lg text-sm font-extrabold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300 disabled:opacity-50 mt-4"
            >
              {isPending ? "가입 중..." : "회원가입"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


