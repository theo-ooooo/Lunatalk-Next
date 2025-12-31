"use client";

import { InquiryForm } from "../form/InquiryForm";
import { InquiryPageLayout } from "../layout/InquiryPageLayout";
import { InquiryEditGuard } from "./InquiryEditGuard";
import { useInquiryDetail } from "@/hooks/inquiry/useInquiryDetail";
import { useUpdateInquiry } from "@/hooks/inquiry/useUpdateInquiry";

export function InquiryEditPageContent() {
  const { inquiry } = useInquiryDetail();
  const { updateInquiry, isPending } = useUpdateInquiry(inquiry.inquiryId);

  return (
    <InquiryEditGuard inquiry={inquiry}>
      <InquiryPageLayout
        backHref={`/inquiries/${inquiry.inquiryId}`}
        backLabel="돌아가기"
        title="문의 수정"
      >
        <InquiryForm
          initialData={inquiry}
          onUpdate={updateInquiry}
          isPending={isPending}
        />
      </InquiryPageLayout>
    </InquiryEditGuard>
  );
}

