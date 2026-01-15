"use client";

import { InquiryForm } from "@/components/inquiry/form/InquiryForm";
import { InquiryPageLayout } from "@/components/inquiry/layout/InquiryPageLayout";
import { useCreateInquiry } from "@/hooks/inquiry/useCreateInquiry";

export default function CreateInquiryPage() {
  const { createInquiry, isPending } = useCreateInquiry();

  return (
    <InquiryPageLayout backHref="/inquiries" title="문의하기">
      <InquiryForm onCreate={createInquiry} isPending={isPending} />
    </InquiryPageLayout>
  );
}


