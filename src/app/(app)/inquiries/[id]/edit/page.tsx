"use client";

import { Suspense } from "react";
import { InquiryEditPageContent } from "@/components/inquiry/edit/InquiryEditPageContent";
import { Loading } from "@/components/common/Loading";
import { QueryErrorBoundary } from "@/components/common/QueryErrorBoundary";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default function InquiryEditPage() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<Loading message="문의 정보를 불러오는 중..." />}>
        <InquiryEditPageContent />
      </Suspense>
    </QueryErrorBoundary>
  );
}


