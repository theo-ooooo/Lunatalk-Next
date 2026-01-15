"use client";

import Link from "next/link";
import { Order } from "@/types/api";
import { formatPrice, getOrderStatusLabel } from "@/lib/utils";

function statusBadgeClass(status: Order["status"]) {
  switch (status) {
    case "PAYMENT_FAILED":
      return "border-red-200 text-red-700 bg-red-50";
    case "CANCELLED":
      return "border-slate-200 text-slate-600 bg-slate-50";
    default:
      return "border-slate-200 text-slate-700 bg-white";
  }
}

interface OrderListTableProps {
  orders: Order[];
}

export default function OrderListTable({ orders }: OrderListTableProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Desktop header */}
      <div className="hidden md:grid grid-cols-12 px-6 py-3 text-xs font-semibold text-slate-500 bg-white border-b border-slate-200">
        <div className="col-span-3">주문번호</div>
        <div className="col-span-4">상품</div>
        <div className="col-span-2">주문일</div>
        <div className="col-span-2">상태</div>
        <div className="col-span-1 text-right">금액</div>
      </div>

      <div className="divide-y divide-slate-200">
        {orders.map((order) => {
          const firstName =
            order.orderItems.length > 1
              ? `${order.orderItems[0].productName} 외 ${order.orderItems.length - 1}개`
              : order.orderItems[0]?.productName;

          const dateText = new Date(order.createdAt).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });

          return (
            <Link
              key={order.orderId}
              href={`/orders/${order.orderNumber}`}
              className="block hover:bg-slate-50 transition-colors"
            >
              <div className="px-4 sm:px-6 py-4">
                {/* Mobile */}
                <div className="md:hidden">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-extrabold text-slate-900">
                        {order.orderNumber}
                      </div>
                      <div className="mt-1 text-xs text-slate-500 line-clamp-1">
                        {firstName}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-extrabold text-slate-900">
                        {formatPrice(order.totalPrice)}원
                      </div>
                      <div className="mt-1 text-xs text-slate-500">{dateText}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-semibold border ${statusBadgeClass(
                        order.status
                      )}`}
                    >
                      {getOrderStatusLabel(order.status)}
                    </span>
                    <span className="text-xs text-slate-400">
                      총 {order.orderItems.length}개
                    </span>
                  </div>
                </div>

                {/* Desktop */}
                <div className="hidden md:grid grid-cols-12 items-center gap-3">
                  <div className="col-span-3 text-sm font-extrabold text-slate-900">
                    {order.orderNumber}
                  </div>
                  <div className="col-span-4 text-sm text-slate-700 line-clamp-1">
                    {firstName}
                  </div>
                  <div className="col-span-2 text-sm text-slate-600">{dateText}</div>
                  <div className="col-span-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-semibold border ${statusBadgeClass(
                        order.status
                      )}`}
                    >
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </div>
                  <div className="col-span-1 text-right text-sm font-extrabold text-slate-900">
                    {formatPrice(order.totalPrice)}원
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}


