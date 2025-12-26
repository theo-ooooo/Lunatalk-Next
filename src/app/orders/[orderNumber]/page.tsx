"use client";

import { Suspense } from "react";
import {
  formatPrice,
  getOrderStatusLabel,
  getOrderStatusColor,
} from "@/lib/utils";
import Link from "next/link";
import {
  ChevronLeft,
  CreditCard,
  Package,
  MessageSquare,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DeliveryInfo } from "@/components/order/DeliveryInfo";
import { OrderItems } from "@/components/order/OrderItems";
import { useOrderDetail } from "@/hooks/order/useOrderDetail";
import { Loading } from "@/components/common/Loading";
import { QueryErrorBoundary } from "@/components/common/QueryErrorBoundary";

function OrderDetailContent() {
  const { order, delivery } = useOrderDetail();

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-4">
          <Link
            href="/mypage"
            className="p-1.5 sm:p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 text-slate-600" />
          </Link>
          <h1 className="text-xl sm:text-2xl lg:text-xl font-bold text-slate-900">
            주문 상세
          </h1>
        </div>

        {/* Order Status Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 mb-4 sm:mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm text-slate-300 mb-2">
                  주문번호:{" "}
                  <span className="font-mono break-all">
                    {order.orderNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <span
                    className={`inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold border ${getOrderStatusColor(
                      order.status
                    )}`}
                  >
                    {getOrderStatusLabel(order.status)}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-300">
                    {new Date(order.createdAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm px-3 sm:px-4"
                >
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">문의하기</span>
                  <span className="sm:hidden">문의</span>
                </Button>
                {order.status === "ORDERED" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm px-3 sm:px-4"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">주문 취소</span>
                    <span className="sm:hidden">취소</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          {/* Left Column - Order Items & Payment */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-5">
              <div className="flex items-center gap-2 mb-4 sm:mb-6 lg:mb-4 pb-3 sm:pb-4 lg:pb-3 border-b border-slate-200">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 text-slate-900 flex-shrink-0" />
                <h2 className="text-base sm:text-lg lg:text-base font-bold text-slate-900">
                  주문 상품
                </h2>
                <span className="ml-auto text-xs sm:text-sm lg:text-xs text-slate-500">
                  총 {order.orderItems.length}개
                </span>
              </div>
              <OrderItems items={order.orderItems} />
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-5">
              <div className="flex items-center gap-2 mb-4 sm:mb-6 lg:mb-4 pb-3 sm:pb-4 lg:pb-3 border-b border-slate-200">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 text-slate-900 flex-shrink-0" />
                <h2 className="text-base sm:text-lg lg:text-base font-bold text-slate-900">
                  결제 정보
                </h2>
              </div>

              <div className="space-y-3 sm:space-y-4 lg:space-y-3">
                <div className="flex justify-between items-center py-1.5 sm:py-2 lg:py-1.5">
                  <span className="text-sm sm:text-base lg:text-sm text-slate-600">
                    상품금액
                  </span>
                  <span className="text-sm sm:text-base lg:text-sm font-medium text-slate-900">
                    {formatPrice(order.totalPrice)}원
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 sm:py-2 lg:py-1.5">
                  <span className="text-sm sm:text-base lg:text-sm text-slate-600">
                    배송비
                  </span>
                  <span className="text-sm sm:text-base lg:text-sm font-medium text-slate-900">
                    0원
                  </span>
                </div>
                <div className="border-t-2 border-slate-200 pt-3 sm:pt-4 lg:pt-3 mt-3 sm:mt-4 lg:mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base sm:text-lg lg:text-base font-bold text-slate-900">
                      총 결제금액
                    </span>
                    <span className="text-xl sm:text-2xl lg:text-xl font-bold text-slate-900">
                      {formatPrice(order.totalPrice)}원
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Delivery Info */}
          <div className="lg:col-span-2">
            {delivery ? (
              <DeliveryInfo delivery={delivery} orderStatus={order.status} />
            ) : (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
                <p className="text-sm sm:text-base text-slate-500 text-center py-6 sm:py-8">
                  배송 정보가 없습니다.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
          <Link href="/mypage" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:min-w-[150px] lg:min-w-[120px] text-sm sm:text-base lg:text-sm"
            >
              목록으로
            </Button>
          </Link>
          <Link href="/products" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:min-w-[150px] lg:min-w-[120px] text-sm sm:text-base lg:text-sm"
            >
              쇼핑 계속하기
            </Button>
          </Link>
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
