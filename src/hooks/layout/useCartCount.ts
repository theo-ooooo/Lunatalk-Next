"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { cartApi } from "@/services/api";

export function useCartCount() {
  const { isAuthenticated } = useAuthStore();

  const { data: cartItems } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCartItems,
    enabled: isAuthenticated,
    staleTime: 1000 * 30,
  });

  const cartCount =
    isAuthenticated && Array.isArray(cartItems) ? cartItems.length : 0;

  return { cartCount, isAuthenticated };
}
