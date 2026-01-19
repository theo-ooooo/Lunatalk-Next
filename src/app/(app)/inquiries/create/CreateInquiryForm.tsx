"use client";

import { InquiryForm } from "@/components/inquiry/form/InquiryForm";
import { useCreateInquiry } from "@/hooks/inquiry/useCreateInquiry";
import { useInquiryFormDefaults } from "@/hooks/inquiry/useInquiryFormDefaults";

interface CreateInquiryFormProps {
  orderNumber?: string;
}

export function CreateInquiryForm({ orderNumber }: CreateInquiryFormProps) {
  const { createInquiry, isPending } = useCreateInquiry();
  const { initialType, initialOrderNumber } = useInquiryFormDefaults({
    orderNumber,
  });

  return (
    <InquiryForm
      onCreate={createInquiry}
      isPending={isPending}
      initialType={initialType}
      initialOrderNumber={initialOrderNumber}
    />
  );
}
