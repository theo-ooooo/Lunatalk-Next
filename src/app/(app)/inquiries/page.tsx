"use client";

import { useState } from "react";
import { InquiryList } from "@/components/inquiry/list/InquiryList";
import { InquiryFilter } from "@/components/inquiry/list/InquiryFilter";
import { InquiryPagination } from "@/components/inquiry/list/InquiryPagination";
import { InquiryPageHeader } from "@/components/inquiry/list/InquiryPageHeader";
import { useInquiries } from "@/hooks/inquiry/useInquiries";
import { Loading } from "@/components/common/Loading";
import { QueryErrorBoundary } from "@/components/common/QueryErrorBoundary";

export default function InquiriesPage() {
  const [page, setPage] = useState(0);
  const [type, setType] = useState<"PRODUCT" | "ORDER" | "GENERAL" | undefined>(
    undefined
  );
  const [status, setStatus] = useState<
    "PENDING" | "ANSWERED" | "CLOSED" | undefined
  >(undefined);

  const { data, isLoading } = useInquiries({
    page,
    size: 10,
    type,
    status,
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        <InquiryPageHeader />

        <InquiryFilter
          type={type}
          status={status}
          onTypeChange={setType}
          onStatusChange={setStatus}
        />

        <QueryErrorBoundary>
          {isLoading ? (
            <Loading message="문의 내역을 불러오는 중..." />
          ) : (
            <InquiryList
              inquiries={data?.content || []}
              isLoading={isLoading}
            />
          )}
        </QueryErrorBoundary>

        {data && (
          <InquiryPagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}


