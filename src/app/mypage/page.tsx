"use client";

import { CreditCard, Truck, FileText, Package } from "lucide-react";
import { useMyPage } from "@/hooks/mypage/useMyPage";
import { OrderHistoryList } from "@/components/mypage/OrderHistoryList";
import { QuickMenu } from "@/components/mypage/QuickMenu";
import { ProfileSection } from "@/components/mypage/ProfileSection";

export default function MyPage() {
  const { me, ordersData, isLoading, orderStats, quickMenuItems } = useMyPage();

  if (!me) return <div className="py-20 text-center">로그인이 필요합니다.</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Section */}
        <div className="mb-6">
          <ProfileSection member={me} />
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-slate-600">결제완료</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {orderStats.paymentCompleted}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-slate-600">배송중</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {orderStats.shipped}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-slate-600">배송완료</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {orderStats.delivered}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-slate-600" />
              </div>
              <span className="text-sm text-slate-600">전체 주문</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {orderStats.total}
            </p>
          </div>
        </div>

        {/* Quick Menu */}
        <QuickMenu items={quickMenuItems} />

        {/* Recent Orders */}
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
    </div>
  );
}
