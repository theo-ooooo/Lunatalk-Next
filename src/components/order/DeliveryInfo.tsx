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
    <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-5 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-4 sm:mb-6 lg:mb-4">
        <Truck className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 text-slate-900 flex-shrink-0" />
        <h3 className="font-bold text-base sm:text-lg lg:text-base text-slate-900">
          배송 정보
        </h3>
      </div>

      <div className="space-y-3 sm:space-y-4 lg:space-y-3 text-xs sm:text-sm md:text-base lg:text-sm">
        <InfoRow label="받는 분" value={delivery.receiverName} />
        <InfoRow label="연락처" value={delivery.receiverPhone} />
        <InfoRow label="주소">
          {delivery.zipcode && (
            <p className="text-slate-500 text-xs sm:text-sm lg:text-xs">
              ({delivery.zipcode})
            </p>
          )}
          <p className="text-xs sm:text-sm lg:text-xs break-words">
            {delivery.addressLine1}
          </p>
          {delivery.addressLine2 && (
            <p className="text-xs sm:text-sm lg:text-xs break-words">
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
          <div className="pt-3 sm:pt-4 lg:pt-3 border-t border-slate-100">
            <a
              href={trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 sm:px-5 lg:px-4 py-2 sm:py-2.5 lg:py-2 bg-slate-900 text-white text-xs sm:text-sm lg:text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors w-full sm:w-auto justify-center"
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

