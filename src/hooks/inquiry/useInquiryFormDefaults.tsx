"use client";

interface UseInquiryFormDefaultsProps {
  orderNumber?: string;
}

export function useInquiryFormDefaults({
  orderNumber,
}: UseInquiryFormDefaultsProps) {
  const initialType = orderNumber ? ("ORDER" as const) : undefined;
  const initialOrderNumber = orderNumber || undefined;

  return {
    initialType,
    initialOrderNumber,
  };
}

