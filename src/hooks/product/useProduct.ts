import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/services/api";

export function useProduct(productId: number) {
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => productApi.getProduct(productId),
    enabled: !!productId,
  });

  return {
    product,
    isLoading,
    isError,
    error,
  };
}

