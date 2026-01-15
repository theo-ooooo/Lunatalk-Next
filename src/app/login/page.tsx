"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLogin } from "@/hooks/auth/useLogin";
import { useAuthStore } from "@/store/useAuthStore";
import { FormEvent } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, accessToken } = useAuthStore();
  const { handleLogin, isPending } = useLogin();

  // 토큰이 있으면 이전 페이지로 리다이렉트
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      const redirect = searchParams.get("redirect");
      router.push(redirect || "/");
    }
  }, [isAuthenticated, accessToken, router, searchParams]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    await handleLogin(username, password);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">로그인</h2>
          <p className="mt-2 text-sm text-slate-600">
            루나톡에 오신 것을 환영합니다.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                아이디
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-lg focus:outline-none focus:ring-slate-500 focus:border-slate-500 focus:z-10 sm:text-sm"
                placeholder="아이디"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-lg focus:outline-none focus:ring-slate-500 focus:border-slate-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50"
          >
            {isPending ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="text-center text-sm">
          <span className="text-slate-600">아직 회원이 아니신가요? </span>
          <Link
            href="/register"
            className="font-medium text-slate-900 hover:text-slate-700"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
