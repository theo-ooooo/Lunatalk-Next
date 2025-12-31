import { useQuery } from "@tanstack/react-query";
import { inquiryApi } from "@/services/api";

export function useInquiries(params: {
  page: number;
  size: number;
  sort?: string[];
  type?: "PRODUCT" | "ORDER" | "GENERAL";
  status?: "PENDING" | "ANSWERED" | "CLOSED";
}) {
  return useQuery({
    queryKey: ["inquiries", params],
    queryFn: () => inquiryApi.getMyInquiries(params),
  });
}

