"use client";

import Link from "next/link";
import { Package, ChevronRight, User } from "lucide-react";
import { useMyPage } from "@/hooks/mypage/useMyPage";
import { OrderHistoryItem } from "@/components/mypage/OrderHistoryItem";

export default function MyPage() {
  const { me, ordersData, isLoading } = useMyPage();

  if (!me)
    return <div className="py-20 text-center">로그인이 필요합니다.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">마이페이지</h1>

      {/* Profile Card */}
      <div className="bg-white p-8 rounded-xl border mb-8 flex items-center gap-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
          <User className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-1">
            {me.nickname || me.username}님
          </h2>
          <p className="text-slate-500">{me.email}</p>
          <div className="mt-4 flex gap-4 text-sm">
            <span className="bg-slate-100 text-slate-900 px-3 py-1 rounded-full font-medium">
              일반 회원
            </span>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Package className="w-5 h-5" />
            최근 주문 내역
          </h3>
          <Link
            href="/orders"
            className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1"
          >
            전체보기 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-slate-500">로딩 중...</div>
        ) : ordersData &&
          ordersData.content &&
          Array.isArray(ordersData.content) &&
          ordersData.content.length > 0 ? (
          <div className="space-y-4">
            {ordersData.content.map((order) => (
              <OrderHistoryItem key={order.orderId} order={order} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-slate-50 rounded-lg text-slate-500">
            주문 내역이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

