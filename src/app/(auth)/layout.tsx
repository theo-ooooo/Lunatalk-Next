"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <>
      {/* Auth routes: desktop back only, no global header/footer */}
      <div className="hidden md:block border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-900 hover:bg-slate-50 border border-slate-200 rounded-md px-3 h-9"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="w-4 h-4" />
            뒤로가기
          </button>
        </div>
      </div>

      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <MobileBottomNav />
    </>
  );
}


