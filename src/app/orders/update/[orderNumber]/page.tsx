"use client";

import { Suspense } from "react";
import OrderUpdateClient from "@/components/order/OrderUpdateClient";
import { useOrderUpdate } from "@/hooks/order/useOrderUpdate";
import { Loading } from "@/components/common/Loading";
import { QueryErrorBoundary } from "@/components/common/QueryErrorBoundary";

function OrderUpdateContent() {
  const { order } = useOrderUpdate();

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-2xl font-bold mb-8 text-slate-900">
          주문 결제 및 배송 정보 입력
        </h1>
        <OrderUpdateClient order={order} />
      </div>
    </div>
  );
}

export default function OrderUpdatePage() {
  return (
    <QueryErrorBoundary
      fallback={
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
          <p className="text-slate-500 font-medium">
            주문 정보를 불러올 수 없습니다.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold"
          >
            다시 시도
          </button>
        </div>
      }
    >
      <Suspense fallback={<Loading message="주문 정보를 불러오는 중..." />}>
        <OrderUpdateContent />
      </Suspense>
    </QueryErrorBoundary>
  );
}
