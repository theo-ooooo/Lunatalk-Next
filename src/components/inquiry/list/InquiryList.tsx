import { InquiryResponse } from "@/types/api";
import { MessageSquare, ChevronRight } from "lucide-react";
import Link from "next/link";

interface InquiryListProps {
  inquiries: InquiryResponse[];
  isLoading?: boolean;
}

const getTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    PRODUCT: "상품문의",
    ORDER: "주문문의",
    GENERAL: "일반문의",
  };
  return typeMap[type] || type;
};

const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    PENDING: "대기중",
    ANSWERED: "답변완료",
    CLOSED: "종료",
  };
  return statusMap[status] || status;
};

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    ANSWERED: "bg-green-100 text-green-700",
    CLOSED: "bg-slate-100 text-slate-700",
  };
  return colorMap[status] || "bg-slate-100 text-slate-600";
};

export function InquiryList({
  inquiries,
  isLoading = false,
}: InquiryListProps) {
  if (isLoading) {
    return <div className="py-20 text-center text-slate-500">로딩 중...</div>;
  }

  if (!inquiries || inquiries.length === 0) {
    return (
      <div className="py-20 text-center bg-slate-50 rounded-lg text-slate-500">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-slate-400" />
        <p className="text-lg font-medium mb-2">문의 내역이 없습니다</p>
        <p className="text-sm text-slate-400 mb-6">
          궁금한 사항이 있으시면 문의해주세요!
        </p>
        <Link
          href="/inquiries/create"
          className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
        >
          문의하기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {inquiries.map((inquiry) => (
        <Link
          key={inquiry.inquiryId}
          href={`/inquiries/${inquiry.inquiryId}`}
          className="block"
        >
          <div className="border border-slate-200 rounded-lg p-5 hover:border-slate-300 hover:shadow-sm transition-all bg-white">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700`}
                  >
                    {getTypeLabel(inquiry.type)}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-medium ${getStatusColor(
                      inquiry.status
                    )}`}
                  >
                    {getStatusLabel(inquiry.status)}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">
                  {inquiry.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2">
                  {inquiry.content}
                </p>
                {inquiry.referenceName && (
                  <p className="text-xs text-slate-400 mt-1">
                    관련: {inquiry.referenceName}
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-2">
                  {new Date(inquiry.createdAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

