import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { inquiryApi } from "@/services/api";

export function useInquiryDetail() {
  const params = useParams();
  const inquiryId = params?.id as string;

  if (!inquiryId) {
    throw new Error("문의 ID가 필요합니다.");
  }

  const { data: inquiry } = useSuspenseQuery({
    queryKey: ["inquiry", inquiryId],
    queryFn: () => inquiryApi.getInquiry(Number(inquiryId)),
  });

  if (!inquiry) {
    throw new Error("문의 정보를 불러올 수 없습니다.");
  }

  return {
    inquiry,
  };
}

