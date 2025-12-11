"use client";

import { orderApi } from "@/services/api";
import { notFound, useParams } from "next/navigation";
import OrderUpdateClient from "@/components/order/OrderUpdateClient";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function OrderUpdatePage() {
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
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold"
        >
          다시 시도
        </button>
      </div>
    );
  }

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
