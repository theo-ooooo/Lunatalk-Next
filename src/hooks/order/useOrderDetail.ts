import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { orderApi } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";

export function useOrderDetail() {
  const params = useParams();
  const orderNumber = params?.orderNumber as string;
  const { isAuthenticated } = useAuthStore();

  const { data: order } = useSuspenseQuery({
    queryKey: ["order", orderNumber],
    queryFn: () => orderApi.getOrder(orderNumber),
    enabled: !!orderNumber && isAuthenticated,
  });

  const delivery = order?.deliveries?.[0];

  if (!order) {
    throw new Error("주문 정보를 불러올 수 없습니다.");
  }

  return {
    order,
    delivery,
  };
}

