import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Order } from "@/types/api";
import { useModalStore } from "@/store/useModalStore";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { orderApi } from "@/services/api";
import { Button } from "@/components/ui/Button";
import React from "react";

export function useOrderUpdate(order: Order) {
  const router = useRouter();
  const { openModal, closeModal } = useModalStore();
  const [loading, setLoading] = useState(false);

  // Daum Postcode Hook
  const openPostcode = useDaumPostcodePopup();

  // 배송지 정보 초기화
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

  return {
    shippingInfo,
    loading,
    handleChange,
    handleAddressSearch,
    handlePayment,
  };
}

