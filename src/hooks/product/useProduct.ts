import { useSuspenseQuery } from "@tanstack/react-query";
import { productApi } from "@/services/api";

export function useProduct(productId: number) {
  // useSuspenseQuery는 enabled 옵션을 지원하지 않음
  // productId가 없으면 에러를 throw
  if (!productId) {
    throw new Error("상품 ID가 필요합니다.");
  }

  const { data: product } = useSuspenseQuery({
    queryKey: ["product", productId],
    queryFn: () => productApi.getProduct(productId),
  });

  if (!product) {
    throw new Error("상품을 찾을 수 없습니다.");
  }

  return { product };
}

