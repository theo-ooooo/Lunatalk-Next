import { formatPrice, getCourierCompanyName, getTrackingUrl, getDeliveryStatusLabel } from "@/lib/utils";
import { Order } from "@/types/api";
import React from "react";
import { Truck, ExternalLink } from "lucide-react";
import Link from "next/link";

interface OrderHistoryItemProps {
  order: Order;
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


const shouldShowDeliveryInfo = (orderStatus: string, deliveryStatus?: string) => {
  // 주문 상태가 배송중/배송완료이거나, 배송 상태가 있는 경우 표시
  const orderShipped = 
    orderStatus === "SHIPPED" ||
    orderStatus === "DELIVERED";
  
  // 배송 상태가 READY 이상이면 표시
  const deliveryExists = deliveryStatus && 
    (deliveryStatus === "READY" ||
     deliveryStatus === "SHIPPED" ||
     deliveryStatus === "DELIVERED" ||
     deliveryStatus === "RETURNED" ||
     deliveryStatus === "REDELIVERY");
  
  return orderShipped || deliveryExists;
};

export function OrderHistoryItem({ order }: OrderHistoryItemProps) {
  const delivery = order.deliveries?.[0];
  const showDeliveryInfo = shouldShowDeliveryInfo(order.status, delivery?.status) && delivery;
  const isShipped = delivery?.status === "SHIPPED" || order.status === "SHIPPED";
  const trackingUrl = delivery?.courierCompany && delivery?.trackingNumber 
    ? getTrackingUrl(delivery.courierCompany, delivery.trackingNumber)
    : null;

  return (
    <div className="border rounded-lg p-6 bg-white hover:border-slate-300 transition-colors">
      <div className="flex justify-between items-start mb-4 pb-4 border-b">
        <div>
          <span className="text-sm text-slate-500 block mb-1">
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
          <Link
            href={`/orders/${order.orderNumber}`}
            className="font-bold text-lg hover:text-slate-600 transition-colors"
          >
            {order.orderNumber}
          </Link>
        </div>
        <span
          className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(
            order.status
          )}`}
        >
          {getStatusLabel(order.status)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {order.orderItems.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-slate-700 line-clamp-1 flex-1 pr-4">
              {item.productName}
              <span className="text-slate-400 text-sm ml-2">
                x {item.quantity}
              </span>
            </span>
            <span className="font-medium">
              {formatPrice(item.totalPrice)}원
            </span>
          </div>
        ))}
      </div>

      {/* 배송 정보 (배송중/배송완료일 때만 표시) */}
      {showDeliveryInfo && (
        <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">배송 정보</span>
          </div>
          <div className="text-sm text-slate-600 space-y-2">
            <div className="flex items-start gap-2">
              <span className="font-medium min-w-[80px]">받는 분:</span>
              <span>{delivery.receiverName}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium min-w-[80px]">연락처:</span>
              <span>{delivery.receiverPhone}</span>
            </div>
            {delivery.trackingNumber && (
              <div className="flex items-start gap-2">
                <span className="font-medium min-w-[80px]">운송장번호:</span>
                <span className="break-all">{delivery.trackingNumber}</span>
              </div>
            )}
            {delivery.courierCompany && (
              <div className="flex items-start gap-2">
                <span className="font-medium min-w-[80px]">택배사:</span>
                <span>{getCourierCompanyName(delivery.courierCompany)}</span>
              </div>
            )}
            {isShipped && trackingUrl && (
              <div className="pt-2 border-t border-slate-200">
                <a
                  href={trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>배송 조회하기</span>
                </a>
              </div>
            )}
            {delivery.status && (
              <div className="flex items-start gap-2">
                <span className="font-medium min-w-[80px]">배송상태:</span>
                <span>{getDeliveryStatusLabel(delivery.status)}</span>
              </div>
            )}
            {(delivery.addressLine1 || delivery.zipcode) && (
              <div className="flex items-start gap-2 pt-1 border-t border-slate-200">
                <span className="font-medium min-w-[80px]">주소:</span>
                <div className="flex-1">
                  {delivery.zipcode && (
                    <span className="text-slate-500">({delivery.zipcode})</span>
                  )}
                  {delivery.addressLine1 && (
                    <p className="mt-1">{delivery.addressLine1}</p>
                  )}
                  {delivery.addressLine2 && (
                    <p>{delivery.addressLine2}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="pt-4 border-t flex justify-end">
        <span className="text-sm text-slate-500 mr-2">총 결제금액</span>
        <span className="font-bold text-lg text-slate-900">
          {formatPrice(order.totalPrice)}원
        </span>
      </div>
    </div>
  );
}
