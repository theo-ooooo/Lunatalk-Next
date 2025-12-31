"use client";

import { InquiryDetail } from "./InquiryDetail";
import { InquiryPageLayout } from "../layout/InquiryPageLayout";
import { useInquiryDetail } from "@/hooks/inquiry/useInquiryDetail";

export function InquiryDetailPageContent() {
  const { inquiry } = useInquiryDetail();

  return (
    <InquiryPageLayout backHref="/inquiries">
      <InquiryDetail inquiry={inquiry} canEdit={true} />
    </InquiryPageLayout>
  );
}

