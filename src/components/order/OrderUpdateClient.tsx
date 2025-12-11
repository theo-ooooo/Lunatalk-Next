"use client";

import { Order } from "@/types/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPrice } from "@/lib/utils";
import { useOrderUpdate } from "@/hooks/order/useOrderUpdate";

interface OrderUpdateClientProps {
  order: Order;
}

export default function OrderUpdateClient({ order }: OrderUpdateClientProps) {
  const {
    shippingInfo,
    loading,
    handleChange,
    handleAddressSearch,
    handlePayment,
  } = useOrderUpdate(order);

  // 이미 결제 완료된 경우 UI를 렌더링하지 않음 (useOrderUpdate 내부에서 리다이렉트)
  if (order.status === "PAYMENT_COMPLETED") {
    return null;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* 왼쪽: 배송지 입력 폼 */}
      <div className="flex-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold mb-4 text-slate-900">배송지 정보</h2>
          <div className="space-y-4">
            <Input
              label="받는 분"
              name="name"
              value={shippingInfo.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              fullWidth
            />
            <Input
              label="연락처"
              name="phone"
              value={shippingInfo.phone}
              onChange={handleChange}
              placeholder="휴대폰 번호를 입력하세요"
              fullWidth
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="우편번호"
                name="zipCode"
                value={shippingInfo.zipCode}
                readOnly
                placeholder="우편번호"
                onClick={handleAddressSearch}
                className="cursor-pointer bg-slate-50"
                fullWidth
              />
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full"
                  onClick={handleAddressSearch}
                >
                  주소 찾기
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                주소
              </label>
              <Input
                name="address1"
                value={shippingInfo.address1}
                readOnly
                placeholder="기본 주소"
                onClick={handleAddressSearch}
                className="mb-2 cursor-pointer bg-slate-50"
                fullWidth
              />
              <Input
                name="address2"
                value={shippingInfo.address2}
                onChange={handleChange}
                placeholder="상세 주소를 입력하세요"
                fullWidth
              />
            </div>
            <Input
              label="배송 메모"
              name="message"
              value={shippingInfo.message}
              onChange={handleChange}
              placeholder="요청사항을 입력하세요 (선택)"
              fullWidth
            />
          </div>
        </div>

        {/* 주문 상품 요약 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold mb-4 text-slate-900">
            주문 상품 ({order.orderItems.length})
          </h2>
          <div className="space-y-4">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://placehold.co/100x100/f1f5f9/94a3b8?text=Product" // 이미지 URL 정보가 OrderItem에 필요함
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {item.productName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span>{item.color}</span>
                    <span>{item.quantity}개</span>
                  </div>
                  <div className="mt-1 font-bold text-sm text-slate-900">
                    {formatPrice(item.price * item.quantity)}원
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 오른쪽: 결제 금액 및 버튼 */}
      <div className="lg:w-80 flex-shrink-0">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
          <h2 className="text-lg font-bold mb-4 text-slate-900">결제 정보</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-slate-600">
              <span>총 상품금액</span>
              <span>{formatPrice(order.totalPrice)}원</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>배송비</span>
              <span>0원</span>
            </div>
            <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
              <span className="font-bold text-lg text-slate-900">
                총 결제금액
              </span>
              <span className="font-bold text-xl text-slate-900">
                {formatPrice(order.totalPrice)}원
              </span>
            </div>
          </div>
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={handlePayment}
            isLoading={loading}
          >
            {formatPrice(order.totalPrice)}원 결제하기
          </Button>
        </div>
      </div>
    </div>
  );
}
