import { useSuspenseQuery } from "@tanstack/react-query";
import { productApi } from "@/services/api";

export function useProduct(productId: number) {
  const { data: product } = useSuspenseQuery({
    queryKey: ["product", productId],
    queryFn: () => productApi.getProduct(productId),
    enabled: !!productId,
  });

  if (!product) {
    throw new Error("상품을 찾을 수 없습니다.");
  }

  return { product };
}

