"use client";

import Link from "next/link";
import { useLogin } from "@/hooks/auth/useLogin";
import { FormEvent, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import AuthTabs from "@/components/auth/AuthTabs";

export default function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, accessToken } = useAuthStore();
  const { handleLogin, isPending } = useLogin();

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
    <div className="min-h-[calc(100vh-4rem)] bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="pb-4 mb-6 border-b border-slate-100">
          <h1 className="text-[18px] md:text-[22px] font-extrabold text-slate-900">
            로그인/회원가입
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            로그인 후 더 많은 혜택을 받아보세요.
          </p>
        </div>

        <AuthTabs />

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            <div className="space-y-3">
              <div>
                <label htmlFor="username" className="sr-only">
                  아이디
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none relative block w-full h-11 px-4 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-lg focus:outline-none focus:ring-0 focus:border-slate-900 sm:text-sm"
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
                  className="appearance-none relative block w-full h-11 px-4 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-lg focus:outline-none focus:ring-0 focus:border-slate-900 sm:text-sm"
                  placeholder="비밀번호"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full flex justify-center h-11 items-center px-4 border border-transparent text-sm font-extrabold rounded-lg text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300 disabled:opacity-50"
            >
              {isPending ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-sm text-slate-600">
            계정이 없으신가요?{" "}
            <Link
              href="/register"
              className="font-extrabold text-slate-900 hover:underline"
            >
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


