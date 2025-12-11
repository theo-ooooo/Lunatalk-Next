"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Order } from "@/types/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPrice } from "@/lib/utils";
import { useModalStore } from "@/store/useModalStore";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { orderApi } from "@/services/api";

interface OrderUpdateClientProps {
  order: Order;
}

export default function OrderUpdateClient({ order }: OrderUpdateClientProps) {
  const router = useRouter();
  const { openModal, closeModal } = useModalStore();
  const [loading, setLoading] = useState(false);

  // Daum Postcode Hook
  const openPostcode = useDaumPostcodePopup();

  // 배송지 정보 초기화 로직 수정
  // deliveries 배열의 첫 번째 항목이 있으면 해당 정보를 사용
  const initialDelivery = order.deliveries?.[0];

  const [shippingInfo, setShippingInfo] = useState({
    name: initialDelivery?.receiverName || order.member?.username || "",
    phone: initialDelivery?.receiverPhone || order.member?.phone || "",
    zipCode: initialDelivery?.zipcode || "",
    address1: initialDelivery?.addressLine1 || "",
    address2: initialDelivery?.addressLine2 || "",
    message: initialDelivery?.message || "",
  });

  // 주문 상태 체크 및 리다이렉트
  useEffect(() => {
    if (order.status === "PAYMENT_COMPLETED") {
      // 이미 결제된 주문이면 장바구니 페이지로 이동 (요청사항)
      router.replace("/cart");
    }
  }, [order.status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  // 주소 검색 핸들러
  const handleAddressSearch = () => {
    openPostcode({
      onComplete: (data) => {
        setShippingInfo((prev) => ({
          ...prev,
          zipCode: data.zonecode,
          address1: data.address,
          address2: "", // 상세주소 초기화
        }));
      },
    });
  };

  // 팝업 메시지 리스너 (결제 성공/실패 감지)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "PAYMENT_SUCCESS") {
        setLoading(false);
        const orderId = event.data.orderId; // orderNumber
        // 결제 성공 후 페이지 이동
        router.push(`/orders/${orderId}`);
      } else if (event.data.type === "PAYMENT_FAIL") {
        setLoading(false);
        openModal({
          title: "결제 실패",
          content: <p>{event.data.message || "결제 처리에 실패했습니다."}</p>,
          footer: (
            <Button variant="primary" fullWidth onClick={closeModal}>
              확인
            </Button>
          ),
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handlePayment = async () => {
    if (
      !shippingInfo.name ||
      !shippingInfo.phone ||
      !shippingInfo.zipCode ||
      !shippingInfo.address1
    ) {
      openModal({
        title: "입력 확인",
        content: <p>배송지 정보를 모두 입력해주세요.</p>,
        footer: (
          <Button variant="primary" fullWidth onClick={closeModal}>
            확인
          </Button>
        ),
      });
      return;
    }

    setLoading(true);
    try {
      // 1. 배송지 정보 등록 (PATCH API 호출)
      await orderApi.registerDelivery(order.orderNumber, {
        address1: shippingInfo.address1,
        address2: shippingInfo.address2,
        phoneNumber: shippingInfo.phone,
        zipCode: shippingInfo.zipCode,
        name: shippingInfo.name,
        message: shippingInfo.message,
      });

      // 2. 새 창으로 결제 페이지 열기
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        `/orders/payment/checkout?orderNumber=${
          order.orderNumber
        }&customerName=${encodeURIComponent(shippingInfo.name)}`,
        "TossPayment",
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      );

      if (!popup) {
        throw new Error("팝업 차단을 해제해주세요.");
      }
    } catch (error: any) {
      console.error(error);
      openModal({
        title: "오류 발생",
        content: <p>{error.message || "처리 중 오류가 발생했습니다."}</p>,
        footer: (
          <Button variant="primary" fullWidth onClick={closeModal}>
            확인
          </Button>
        ),
      });
      setLoading(false);
    }
  };

  // 이미 결제 완료된 경우 UI를 렌더링하지 않거나 로딩 등을 보여줄 수 있음
  // useEffect에서 리다이렉트 되지만 깜빡임을 방지하기 위해
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
