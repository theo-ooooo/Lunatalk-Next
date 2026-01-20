"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMyPage } from "@/hooks/mypage/useMyPage";
import { useAuthStore } from "@/store/useAuthStore";
import { OrderHistoryList } from "@/components/mypage/OrderHistoryList";
import Link from "next/link";
import { ChevronRight, User } from "lucide-react";
import { Loading } from "@/components/common/Loading";

export default function MyPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { me, ordersData, isLoading, orderStats } = useMyPage();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/mypage");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loading message="로그인 페이지로 이동 중..." fullScreen={false} />
      </div>
    );
  }

  if (!me) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loading message="정보를 불러오는 중..." fullScreen={false} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-6xl">
        <main className="min-w-0">
          <div className="mb-3 md:mb-4">
            <h1 className="text-[18px] md:text-[22px] font-extrabold text-slate-900">
              마이페이지
            </h1>
          </div>

          <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    {me.provider === "KAKAO" && (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="shrink-0"
                      >
                        <path
                          d="M9 0C4.03 0 0 3.27 0 7.3c0 2.55 1.7 4.8 4.25 6.1L3 18l5.25-2.9c.5.05 1 .1 1.5.1 4.97 0 9-3.27 9-7.3S13.97 0 9 0z"
                          fill="#FEE500"
                        />
                      </svg>
                    )}
                    <div className="text-sm font-extrabold text-slate-900 truncate">
                      {me.nickname || me.username}
                      <span className="font-semibold text-slate-500"> 님</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 truncate mt-0.5">
                    {me.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/mypage/edit"
                  className="h-9 px-3 inline-flex items-center justify-center rounded-md border border-slate-200 text-sm font-extrabold text-slate-900 hover:bg-slate-50"
                >
                  프로필 편집
                </Link>
                <Link
                  href="/mypage/edit"
                  className="h-9 w-9 inline-flex items-center justify-center"
                  aria-label="내 정보"
                >
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-200">
              <div className="px-3 py-3 text-center">
                <div className="text-[11px] font-semibold text-slate-500">
                  적립금
                </div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">
                  0원
                </div>
              </div>
              <div className="px-3 py-3 text-center">
                <div className="text-[11px] font-semibold text-slate-500">
                  주문
                </div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">
                  {orderStats.total}건
                </div>
              </div>
              <div className="px-3 py-3 text-center">
                <div className="text-[11px] font-semibold text-slate-500">
                  쿠폰
                </div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">
                  0장
                </div>
              </div>
            </div>
          </section>

          <section className="mt-3 bg-white border border-slate-200 rounded-xl overflow-hidden">
            <Link
              href="/orders"
              className="flex items-center justify-between px-4 py-4 border-b border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="text-sm font-semibold text-slate-900">
                주문 내역
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </Link>
            <Link
              href="/cart"
              className="flex items-center justify-between px-4 py-4 border-b border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="text-sm font-semibold text-slate-900">
                장바구니
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center justify-between px-4 py-4 border-b border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="text-sm font-semibold text-slate-900">
                관심상품
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </Link>
            <Link
              href="/inquiries"
              className="flex items-center justify-between px-4 py-4 border-b border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="text-sm font-semibold text-slate-900">
                문의 내역
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </Link>
            <Link
              href="/mypage/edit"
              className="flex items-center justify-between px-4 py-4 hover:bg-slate-50 transition-colors"
            >
              <div className="text-sm font-semibold text-slate-900">
                회원 정보 수정
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </Link>
          </section>

          <div id="orders" className="mt-4 scroll-mt-24">
            <OrderHistoryList
              orders={
                ordersData?.content && Array.isArray(ordersData.content)
                  ? ordersData.content
                  : []
              }
              isLoading={isLoading}
              showAllLink={false}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
