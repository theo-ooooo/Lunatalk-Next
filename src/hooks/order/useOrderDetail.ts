import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { orderApi } from "@/services/api";

export function useOrderDetail() {
  const params = useParams();
  const orderNumber = params?.orderNumber as string;

  // useSuspenseQuery는 enabled 옵션을 지원하지 않음
  // 항상 실행되므로 orderNumber만 체크
  if (!orderNumber) {
    throw new Error("주문번호가 필요합니다.");
  }

  const { data: order } = useSuspenseQuery({
    queryKey: ["order", orderNumber],
    queryFn: () => orderApi.getOrder(orderNumber),
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

