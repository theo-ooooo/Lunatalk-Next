"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { orderApi } from "@/services/api";
import { Loader2 } from "lucide-react";
import { useModalStore } from "@/store/useModalStore";
import { Button } from "@/components/ui/Button";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openModal, closeModal } = useModalStore();
  const [isProcessing, setIsProcessing] = useState(true);

  // Toss Payments에서 리다이렉트 시 전달하는 파라미터
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  useEffect(() => {
    if (!paymentKey || !orderId || !amount) {
      // 에러 처리: 부모 창에 메시지 전송 후 닫기
      if (window.opener) {
        window.opener.postMessage(
          { type: "PAYMENT_FAIL", message: "결제 정보가 올바르지 않습니다." },
          window.location.origin
        );
        window.close();
      }
      setIsProcessing(false);
      return;
    }

    const confirm = async () => {
      try {
        await orderApi.confirmPayment({
          paymentKey,
          orderId,
          amount: Number(amount),
        });

        // 결제 승인 성공 시 부모 창에 성공 메시지 전송 후 닫기
        if (window.opener) {
          window.opener.postMessage(
            { type: "PAYMENT_SUCCESS", orderId },
            window.location.origin
          );
          window.close();
        } else {
          // 팝업이 아닌 경우 직접 이동 (fallback)
          router.replace(`/orders/${orderId}`);
        }
      } catch (error) {
        console.error("Payment confirmation failed:", error);
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "PAYMENT_FAIL",
              message: "결제 승인 중 오류가 발생했습니다.",
            },
            window.location.origin
          );
          window.close();
        }
        setIsProcessing(false);
      }
    };

    confirm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-slate-900 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">
          결제 승인 처리 중입니다...
        </h2>
        <p className="text-slate-500 mt-2">잠시만 기다려주세요.</p>
      </div>
    );
  }

  return null;
}
