"use client";

import { orderApi } from "@/services/api";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Truck, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { InfoRow } from "@/components/ui/InfoRow";

export default function OrderDetailPage() {
  const params = useParams();
  const orderNumber = params?.orderNumber as string;
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order", orderNumber],
    queryFn: () => orderApi.getOrder(orderNumber),
    enabled: !!orderNumber && isAuthenticated,
  });

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500 font-medium">
          주문 정보를 불러올 수 없습니다.
        </p>
        <Link href="/">
          <Button>홈으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  // 배송지 정보가 배열로 온다면 첫 번째 것을 사용 (가정)
  const delivery = order.deliveries?.[0];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/mypage"
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">주문 상세</h1>
        </div>

        {/* Order Status Card */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
            <div>
              <span className="text-sm font-bold text-slate-500 mb-1 block">
                주문번호 {order.orderNumber}
              </span>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900">
                  {order.status === "ORDERED"
                    ? "주문 완료"
                    : order.status === "PAYMENT_COMPLETED"
                    ? "결제 완료"
                    : order.status}
                </h2>
                <span className="text-sm text-slate-400 font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                문의하기
              </Button>
              {order.status === "ORDERED" && (
                // 취소 기능은 아직 API가 없으므로 버튼만 둠 (기능 없음)
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  주문 취소
                </Button>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-6">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                {/* 이미지가 OrderItem에 없어서 상품명으로 대체하거나 해야 함. API 수정 전까진 Placeholder 혹은 로직 수정 필요 */}
                <div className="w-20 h-20 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://placehold.co/200x200/f1f5f9/94a3b8?text=Product"
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-slate-400">
                      LUNATALK
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    {item.productName}
                  </h3>
                  <div className="text-sm text-slate-500 mb-2">
                    {item.color && (
                      <span className="mr-2">옵션: {item.color}</span>
                    )}
                    <span>{item.quantity}개</span>
                  </div>
                  <div className="font-bold text-slate-900">
                    {formatPrice(item.price * item.quantity)}원
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Truck className="w-5 h-5 text-slate-900" />
            <h3 className="font-bold text-lg text-slate-900">배송 정보</h3>
          </div>

          {delivery ? (
            <div className="space-y-4 text-sm md:text-base">
              <InfoRow label="받는 분" value={delivery.receiverName} />
              <InfoRow label="연락처" value={delivery.receiverPhone} />
              <InfoRow label="주소">
                <p>({delivery.zipcode})</p>
                <p>{delivery.addressLine1}</p>
                <p>{delivery.addressLine2}</p>
              </InfoRow>
              {delivery.message && (
                <InfoRow label="배송메모" value={delivery.message} />
              )}
            </div>
          ) : (
            <p className="text-slate-500">배송 정보가 없습니다.</p>
          )}
        </div>

        {/* Payment Info */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="w-5 h-5 text-slate-900" />
            <h3 className="font-bold text-lg text-slate-900">결제 정보</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-slate-600">
              <span>총 상품금액</span>
              <span>{formatPrice(order.totalPrice)}원</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>배송비</span>
              <span>0원</span>
            </div>
            <div className="border-t border-slate-100 my-4 pt-4 flex justify-between items-center">
              <span className="font-bold text-lg text-slate-900">
                총 결제금액
              </span>
              <span className="font-bold text-xl text-slate-900">
                {formatPrice(order.totalPrice)}원
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button size="lg" className="min-w-[200px]">
              홈으로 가기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
