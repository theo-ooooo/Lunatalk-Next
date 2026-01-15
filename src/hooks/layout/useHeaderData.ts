"use client";

import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { cartApi, categoryApi } from "@/services/api";

type UseHeaderDataOptions = {
  /**
   * 카테고리 메뉴가 필요한 헤더에서만 켜기.
   * (기본 true)
   */
  enableCategories?: boolean;
};

export function useHeaderData(options: UseHeaderDataOptions = {}) {
  const queryClient = useQueryClient();
  const { isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const enableCategories = options.enableCategories ?? true;

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getCategories,
    staleTime: 1000 * 60 * 5,
    enabled: enableCategories,
  });

  const { data: cartItems } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCartItems,
    enabled: isAuthenticated,
    staleTime: 1000 * 30,
  });

  const cartCount =
    isAuthenticated && Array.isArray(cartItems) ? cartItems.length : 0;

  const categoryList =
    enableCategories && Array.isArray(categories)
      ? categories.filter((c) => c.visibility === "VISIBLE")
      : [];

  const handleLogout = () => {
    // 사용자 개인화 데이터(장바구니/좋아요 등)가 남지 않도록 캐시를 먼저 비운다.
    queryClient.clear();
    logout();
    router.push("/");
    router.refresh();
  };

  return { isAuthenticated, cartCount, categoryList, handleLogout };
}


