"use client";

import { useQuery } from "@tanstack/react-query";
import { Order } from "@/types/api";
import { orderApi } from "@/services/api";
import {
  formatPrice,
  getOrderStatusLabel,
  getOrderStatusColor,
} from "@/lib/utils";
import { Loader2, Package } from "lucide-react";

interface OrderSelectorProps {
  selectedOrderNumber?: string;
  onSelect: (orderNumber: string) => void;
}

export function OrderSelector({
  selectedOrderNumber,
  onSelect,
}: OrderSelectorProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["orders", "inquiry"],
    queryFn: () => orderApi.getOrders({ page: 0, size: 50 }),
  });

  const orders = data?.content || [];

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          <Package className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <p>주문 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto p-2">
          {orders.map((order) => {
            const isSelected = selectedOrderNumber === order.orderNumber;
            return (
              <button
                key={order.orderId}
                type="button"
                onClick={() => onSelect(order.orderNumber)}
                className={`w-full text-left border-2 rounded-lg p-4 transition-all ${
                  isSelected
                    ? "border-slate-900 ring-2 ring-slate-900 ring-offset-2 bg-slate-50"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-lg text-slate-900">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-medium ${getOrderStatusColor(
                          order.status
                        )}`}
                      >
                        {getOrderStatusLabel(order.status)}
                      </span>
                      {isSelected && (
                        <span className="px-2.5 py-1 rounded text-xs font-medium bg-slate-900 text-white">
                          선택됨
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-slate-600 mb-1">
                        {order.orderItems.length > 1
                          ? `${order.orderItems[0].productName} 외 ${
                              order.orderItems.length - 1
                            }개`
                          : order.orderItems[0]?.productName}
                      </p>
                      <p className="text-xs text-slate-400">
                        총 {order.orderItems.length}개 상품
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">
                        {formatPrice(order.totalPrice)}원
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
