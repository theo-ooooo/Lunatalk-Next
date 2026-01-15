"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AuthTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const qs = redirect ? `?redirect=${encodeURIComponent(redirect)}` : "";

  const isLogin = pathname === "/login";
  const isRegister = pathname === "/register";

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 border border-slate-200 rounded-xl overflow-hidden">
        <Link
          href={`/login${qs}`}
          className={cn(
            "py-3 text-center text-sm font-extrabold",
            isLogin ? "bg-slate-900 text-white" : "bg-white text-slate-700 hover:bg-slate-50"
          )}
        >
          로그인
        </Link>
        <Link
          href={`/register${qs}`}
          className={cn(
            "py-3 text-center text-sm font-extrabold border-l border-slate-200",
            isRegister ? "bg-slate-900 text-white" : "bg-white text-slate-700 hover:bg-slate-50"
          )}
        >
          회원가입
        </Link>
      </div>
    </div>
  );
}


