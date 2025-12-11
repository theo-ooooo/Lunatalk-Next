import { formatPrice } from "@/lib/utils";
import { Order } from "@/types/api";
import React from "react";

interface OrderHistoryItemProps {
  order: Order;
}

export function OrderHistoryItem({ order }: OrderHistoryItemProps) {
  return (
    <div className="border rounded-lg p-6 bg-white hover:border-slate-300 transition-colors">
      <div className="flex justify-between items-start mb-4 pb-4 border-b">
        <div>
          <span className="text-sm text-slate-500 block mb-1">
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
          <span className="font-bold text-lg">{order.orderNumber}</span>
        </div>
        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded text-sm font-medium">
          {order.status}
        </span>
      </div>

      <div className="space-y-2">
        {order.orderItems.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-slate-700 line-clamp-1 flex-1 pr-4">
              {item.productName}
              <span className="text-slate-400 text-sm ml-2">
                x {item.quantity}
              </span>
            </span>
            <span className="font-medium">{formatPrice(item.totalPrice)}원</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t flex justify-end">
        <span className="text-sm text-slate-500 mr-2">총 결제금액</span>
        <span className="font-bold text-lg text-slate-900">
          {formatPrice(order.totalPrice)}원
        </span>
      </div>
    </div>
  );
}

