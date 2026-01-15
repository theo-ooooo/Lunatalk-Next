"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { orderApi } from "@/services/api";
import { Loader2 } from "lucide-react";

function extractErrorMessage(error: unknown) {
  // 1) fetchExtended가 throw한 Error(message)
  if (error instanceof Error && error.message) return error.message;

  // 2) 백엔드 에러 응답 객체를 그대로 받은 경우: { data: { message: string } }
  if (typeof error === "object" && error !== null) {
    const maybeData = (error as { data?: unknown }).data;
    if (typeof maybeData === "object" && maybeData !== null) {
      const msg = (maybeData as { message?: unknown }).message;
      if (typeof msg === "string" && msg) return msg;
    }

    // 3) 일반 객체: { message: string }
    const msg = (error as { message?: unknown }).message;
    if (typeof msg === "string" && msg) return msg;
  }

  return "결제 승인 중 오류가 발생했습니다.";
}

export default function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    paymentKey: string;
    orderId: string;
    amount: string;
  }>;
}) {
  const params = use(searchParams);
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);

  const paymentKey = params.paymentKey;
  const orderId = params.orderId;
  const amount = params.amount;

  useEffect(() => {
    if (!paymentKey || !orderId || !amount) {
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

        if (window.opener) {
          window.opener.postMessage(
            { type: "PAYMENT_SUCCESS", orderId },
            window.location.origin
          );
          window.close();
        } else {
          router.replace(`/orders/${orderId}`);
        }
      } catch (error) {
        console.error("Payment confirmation failed:", error);
        const errorMessage = extractErrorMessage(error);

        if (window.opener) {
          window.opener.postMessage(
            {
              type: "PAYMENT_FAIL",
              message: errorMessage,
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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
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
