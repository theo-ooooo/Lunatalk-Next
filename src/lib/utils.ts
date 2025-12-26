import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ko-KR").format(price);
};

export const getImageUrl = (path?: string) => {
  console.log("path", path);
  if (!path) return "https://placehold.co/400x400?text=No+Image";

  if (path.startsWith("http")) return path;

  // 앞의 슬래시 제거
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // CDN 도메인 연결
  return `https://media-v2.lunatalk.co.kr/${cleanPath}`;
};

export const getCourierCompanyName = (company: string) => {
  const companyMap: Record<string, string> = {
    CJ_LOGISTICS: "CJ대한통운",
    KOREA_POST: "우체국택배",
    HANJIN: "한진택배",
    LOTTE: "롯데택배",
    LOGEN: "로젠택배",
    DHL: "DHL",
    FEDEX: "FedEx",
    UPS: "UPS",
    OTHER: "기타",
  };
  return companyMap[company] || company;
};

export const getTrackingUrl = (
  courierCompany: string,
  trackingNumber: string
): string | null => {
  if (!trackingNumber) return null;

  const trackingUrls: Record<string, string> = {
    CJ_LOGISTICS: `https://www.cjlogistics.com/ko/tool/parcel/tracking?gnbInvcNo=${trackingNumber}`,
    KOREA_POST: `https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm?sid1=${trackingNumber}`,
    HANJIN: `https://www.hanjin.co.kr/kor/CMS/DeliveryMgr/WaybillResult.do?mCode=MN038&schLang=KR&wblnum=${trackingNumber}`,
    LOTTE: `https://www.lotteglogis.com/home/reservation/tracking/index?invNo=${trackingNumber}`,
    LOGEN: `https://www.ilogen.com/web/personal/trace/${trackingNumber}`,
    DHL: `https://www.dhl.com/ko-ko/home/tracking/tracking-parcel.html?submit=1&tracking-id=${trackingNumber}`,
    FEDEX: `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
    UPS: `https://www.ups.com/track?tracknum=${trackingNumber}`,
  };

  return trackingUrls[courierCompany] || null;
};

export const getDeliveryStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    READY: "배송 준비중",
    SHIPPED: "배송중",
    DELIVERED: "배송완료",
    RETURNED: "반품",
    REDELIVERY: "재배송",
  };
  return statusMap[status] || status;
};

export const getOrderStatusLabel = (status: string) => {
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

export const getOrderStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    ORDERED: "bg-blue-100 text-blue-700 border-blue-200",
    PAYMENT_COMPLETED: "bg-green-100 text-green-700 border-green-200",
    PAYMENT_FAILED: "bg-red-100 text-red-700 border-red-200",
    CANCELLED: "bg-gray-100 text-gray-700 border-gray-200",
    SHIPPED: "bg-purple-100 text-purple-700 border-purple-200",
    DELIVERED: "bg-slate-100 text-slate-700 border-slate-200",
    배송중: "bg-purple-100 text-purple-700 border-purple-200",
    배송완료: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return colorMap[status] || "bg-slate-100 text-slate-600 border-slate-200";
};
