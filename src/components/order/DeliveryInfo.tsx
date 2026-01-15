import { Delivery } from "@/types/api";
import { Truck, ExternalLink } from "lucide-react";
import { getCourierCompanyName, getTrackingUrl, getDeliveryStatusLabel } from "@/lib/utils";
import { InfoRow } from "@/components/ui/InfoRow";

interface DeliveryInfoProps {
  delivery: Delivery;
  orderStatus?: string;
}

export function DeliveryInfo({ delivery, orderStatus }: DeliveryInfoProps) {
  const isShipped =
    delivery.status === "SHIPPED" ||
    orderStatus === "SHIPPED" ||
    orderStatus === "배송중";
  const trackingUrl =
    delivery.courierCompany && delivery.trackingNumber
      ? getTrackingUrl(delivery.courierCompany, delivery.trackingNumber)
      : null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex items-center gap-2">
        <Truck className="w-4 h-4 text-slate-900 flex-shrink-0" />
        <h3 className="text-sm font-extrabold text-slate-900">배송 정보</h3>
      </div>

      <div className="px-4 sm:px-6 py-4 space-y-3 text-sm">
        <InfoRow label="받는 분" value={delivery.receiverName} />
        <InfoRow label="연락처" value={delivery.receiverPhone} />
        <InfoRow label="주소">
          {delivery.zipcode && (
            <p className="text-slate-500 text-xs">
              ({delivery.zipcode})
            </p>
          )}
          <p className="text-sm break-words">
            {delivery.addressLine1}
          </p>
          {delivery.addressLine2 && (
            <p className="text-sm break-words">
              {delivery.addressLine2}
            </p>
          )}
        </InfoRow>
        {delivery.message && (
          <InfoRow label="배송메모" value={delivery.message} />
        )}
        {delivery.trackingNumber && (
          <InfoRow
            label="운송장번호"
            value={
              <span className="break-all text-xs sm:text-sm lg:text-xs">
                {delivery.trackingNumber}
              </span>
            }
          />
        )}
        {delivery.courierCompany && (
          <InfoRow
            label="택배사"
            value={getCourierCompanyName(delivery.courierCompany)}
          />
        )}
        {delivery.status && (
          <InfoRow
            label="배송상태"
            value={getDeliveryStatusLabel(delivery.status)}
          />
        )}
        {isShipped && trackingUrl && (
          <div className="pt-3 border-t border-slate-200">
            <a
              href={trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors w-full justify-center"
            >
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 lg:w-3 lg:h-3" />
              <span>배송 조회하기</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

