"use client";
import { Suspense, use, useEffect, useState } from "react";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { orderApi } from "@/services/api";
import { Loader2 } from "lucide-react";

export default function PaymentCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ orderNumber: string; customerName: string }>;
}) {
  const params = use(searchParams);
  const orderNumber = params.orderNumber;
  const customerName = params.customerName;

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber || !customerName) {
      setError("잘못된 접근입니다.");
      return;
    }

    const initPayment = async () => {
      try {
        const order = await orderApi.getOrder(orderNumber);

        const clientKey =
          process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ||
          "test_ck_D5GePWvyJnrKwdPzN5ggLzN97Eoq";
        const tossPayments = await loadTossPayments(clientKey);
        const origin = window.location.origin;

        await tossPayments.requestPayment("카드", {
          amount: order.totalPrice,
          orderId: order.orderNumber,
          orderName:
            order.orderItems.length > 1
              ? `${order.orderItems[0].productName} 외 ${
                  order.orderItems.length - 1
                }건`
              : order.orderItems[0].productName,
          customerName: customerName,
          successUrl: `${origin}/orders/payment/success`,
          failUrl: `${origin}/orders/payment/fail`,
        });
      } catch (err: any) {
        console.error(err);
        setError(err.message || "결제 초기화 중 오류가 발생했습니다.");
      }
    };

    initPayment();
  }, [orderNumber, customerName]);

  if (error) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex items-center justify-center min-h-screen bg-white">
          <p className="text-red-500 font-bold">{error}</p>
        </div>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-slate-900 mb-4" />
        <p className="text-slate-600 font-medium">
          결제창을 불러오는 중입니다...
        </p>
      </div>
    </Suspense>
  );
}


