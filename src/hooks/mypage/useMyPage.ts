import { useQuery } from "@tanstack/react-query";
import { authApi, orderApi } from "@/services/api";

export function useMyPage() {
  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: authApi.getMe,
  });

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders", 0],
    queryFn: () => orderApi.getOrders({ page: 0, size: 5, sort: ["string"] }),
  });

  return {
    me,
    ordersData,
    isLoading,
  };
}
