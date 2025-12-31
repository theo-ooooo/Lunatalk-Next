"use client";

import { Suspense } from "react";
import { InquiryDetailPageContent } from "@/components/inquiry/detail/InquiryDetailPageContent";
import { Loading } from "@/components/common/Loading";
import { QueryErrorBoundary } from "@/components/common/QueryErrorBoundary";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default function InquiryDetailPage() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<Loading message="문의 정보를 불러오는 중..." />}>
        <InquiryDetailPageContent />
      </Suspense>
    </QueryErrorBoundary>
  );
}
