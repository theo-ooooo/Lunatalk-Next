"use client";

interface InquiryFilterProps {
  type: "PRODUCT" | "ORDER" | "GENERAL" | undefined;
  status: "PENDING" | "ANSWERED" | "CLOSED" | undefined;
  onTypeChange: (type: "PRODUCT" | "ORDER" | "GENERAL" | undefined) => void;
  onStatusChange: (
    status: "PENDING" | "ANSWERED" | "CLOSED" | undefined
  ) => void;
}

export function InquiryFilter({
  type,
  status,
  onTypeChange,
  onStatusChange,
}: InquiryFilterProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 mb-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            문의 유형
          </label>
          <select
            value={type || ""}
            onChange={(e) =>
              onTypeChange(
                e.target.value
                  ? (e.target.value as "PRODUCT" | "ORDER" | "GENERAL")
                  : undefined
              )
            }
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="">전체</option>
            <option value="GENERAL">일반문의</option>
            <option value="PRODUCT">상품문의</option>
            <option value="ORDER">주문문의</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            상태
          </label>
          <select
            value={status || ""}
            onChange={(e) =>
              onStatusChange(
                e.target.value
                  ? (e.target.value as "PENDING" | "ANSWERED" | "CLOSED")
                  : undefined
              )
            }
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="">전체</option>
            <option value="PENDING">대기중</option>
            <option value="ANSWERED">답변완료</option>
            <option value="CLOSED">종료</option>
          </select>
        </div>
      </div>
    </div>
  );
}

