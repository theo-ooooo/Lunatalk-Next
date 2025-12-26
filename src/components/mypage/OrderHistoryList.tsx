import { Order } from "@/types/api";
import { Package, ChevronRight } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface OrderHistoryListProps {
  orders: Order[];
  isLoading?: boolean;
  showAllLink?: boolean;
  maxItems?: number;
}

const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    ORDERED: "주문완료",
    PAYMENT_COMPLETED: "결제완료",
    PAYMENT_FAILED: "결제실패",
    CANCELLED: "취소됨",
    SHIPPED: "배송중",
    DELIVERED: "배송완료",
    배송중: "배송중",
    배송완료: "배송완료",
  };
  return statusMap[status] || status;
};

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    ORDERED: "bg-blue-100 text-blue-700",
    PAYMENT_COMPLETED: "bg-green-100 text-green-700",
    PAYMENT_FAILED: "bg-red-100 text-red-700",
    CANCELLED: "bg-gray-100 text-gray-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-slate-100 text-slate-700",
    배송중: "bg-purple-100 text-purple-700",
    배송완료: "bg-slate-100 text-slate-700",
  };
  return colorMap[status] || "bg-slate-100 text-slate-600";
};

export function OrderHistoryList({
  orders,
  isLoading = false,
  showAllLink = true,
  maxItems,
}: OrderHistoryListProps) {
  const displayOrders = maxItems ? orders.slice(0, maxItems) : orders;

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-500">로딩 중...</div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="py-20 text-center bg-slate-50 rounded-lg text-slate-500">
        <Package className="w-12 h-12 mx-auto mb-4 text-slate-400" />
        <p className="text-lg font-medium mb-2">주문 내역이 없습니다</p>
        <p className="text-sm text-slate-400 mb-6">첫 주문을 시작해보세요!</p>
        <Link href="/products">
          <button className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
            쇼핑하러 가기
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900">
          <Package className="w-5 h-5" />
          최근 주문 내역
        </h3>
        {showAllLink && (
          <Link
            href="/orders"
            className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
          >
            전체보기 <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <div className="space-y-3">
        {displayOrders.map((order) => (
          <Link
            key={order.orderId}
            href={`/orders/${order.orderNumber}`}
            className="block"
          >
            <div className="border border-slate-200 rounded-lg p-5 hover:border-slate-300 hover:shadow-sm transition-all bg-white">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg text-slate-900">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
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
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

