"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  formatPrice,
  getOrderStatusLabel,
  getOrderStatusColor,
} from "@/lib/utils";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DeliveryInfo } from "@/components/order/DeliveryInfo";
import { OrderItems } from "@/components/order/OrderItems";
import { useOrderDetail } from "@/hooks/order/useOrderDetail";
import { Loading } from "@/components/common/Loading";
import { QueryErrorBoundary } from "@/components/common/QueryErrorBoundary";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

function OrderDetailContent() {
  const router = useRouter();
  const { order, delivery } = useOrderDetail();

  const handleInquiryClick = () => {
    router.push(`/inquiries/create?orderNumber=${order.orderNumber}`);
  };

  return (
    <div className="min-h-screen bg-white py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Desktop only title (mobile은 layout의 서브헤더가 있음) */}
        <div className="hidden md:flex items-end justify-between gap-3 mb-5">
          <div>
            <h1 className="text-[18px] md:text-[22px] font-extrabold text-slate-900">
              주문 상세
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              주문 정보와 배송 현황을 확인할 수 있어요.
            </p>
          </div>
        </div>

        {/* Summary */}
        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs text-slate-500">주문번호</div>
              <div className="mt-0.5 font-mono text-sm font-extrabold text-slate-900 break-all">
                {order.orderNumber}
              </div>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getOrderStatusColor(
                    order.status
                  )}`}
                >
                  {getOrderStatusLabel(order.status)}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(order.createdAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3"
                onClick={handleInquiryClick}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                문의
              </Button>
              {order.status === "ORDERED" && (
                <Button variant="outline" size="sm" className="h-9 px-3">
                  <X className="w-4 h-4 mr-2" />
                  취소
                </Button>
              )}
            </div>
          </div>

          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">
                총 결제금액
              </span>
              <span className="text-[18px] sm:text-[20px] font-extrabold text-slate-900">
                {formatPrice(order.totalPrice)}원
              </span>
            </div>
          </div>
        </section>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 space-y-4">
            {/* Items */}
            <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-slate-900">
                  주문 상품
                </h2>
                <span className="text-xs text-slate-500">
                  {order.orderItems.length}개
                </span>
              </div>
              <div className="px-4 sm:px-6 py-2">
                <OrderItems items={order.orderItems} />
              </div>
            </section>

            {/* Payment */}
            <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-slate-200">
                <h2 className="text-sm font-extrabold text-slate-900">
                  결제 정보
                </h2>
              </div>
              <div className="px-4 sm:px-6 py-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">상품금액</span>
                    <span className="font-semibold text-slate-900">
                      {formatPrice(order.totalPrice)}원
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">배송비</span>
                    <span className="font-semibold text-slate-900">0원</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-900">
                    총 결제금액
                  </span>
                  <span className="text-[18px] font-extrabold text-slate-900">
                    {formatPrice(order.totalPrice)}원
                  </span>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-2">
            {delivery ? (
              <DeliveryInfo delivery={delivery} orderStatus={order.status} />
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-sm text-slate-500">
                배송 정보가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<Loading message="주문 정보를 불러오는 중..." />}>
        <OrderDetailContent />
      </Suspense>
    </QueryErrorBoundary>
  );
}
