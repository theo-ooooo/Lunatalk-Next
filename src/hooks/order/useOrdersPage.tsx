"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";
import { Order } from "@/types/api";

export const ORDER_STATUS_OPTIONS: Array<{
  value: "" | Order["status"];
  label: string;
}> = [
  { value: "", label: "전체" },
  { value: "ORDERED", label: "주문완료" },
  { value: "PAYMENT_COMPLETED", label: "결제완료" },
  { value: "PAYMENT_FAILED", label: "결제실패" },
  { value: "CANCELLED", label: "취소됨" },
  { value: "SHIPPED", label: "배송중" },
  { value: "DELIVERED", label: "배송완료" },
];

export function useOrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | Order["status"]>("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) router.push("/login?redirect=/orders");
  }, [isAuthenticated, router]);

  const isSearching = query.trim().length > 0 || statusFilter !== "";

  // 일반 상태: 페이지네이션
  const pagedQuery = useQuery({
    queryKey: ["orders", "my", "paged", page],
    queryFn: () => orderApi.getOrders({ page, size: 20 }),
    enabled: isAuthenticated && !isSearching,
    staleTime: 1000 * 10,
  });

  // 검색/상태필터: 서버에 검색 파라미터가 없어서 전체 주문을 페이지 순회로 가져와서 필터링
  const allQuery = useQuery({
    queryKey: ["orders", "my", "all", query.trim().toLowerCase(), statusFilter],
    queryFn: async () => {
      const size = 100;
      const all: Order[] = [];
      let p = 0;

      // 안전장치: 비정상적으로 많은 페이지를 무한히 긁지 않도록 상한
      const MAX_PAGES = 200;

      while (p < MAX_PAGES) {
        const res = await orderApi.getOrders({ page: p, size });
        all.push(...(res.content || []));
        if (res.last || (res.content?.length ?? 0) === 0) break;
        p += 1;
      }

      return all;
    },
    enabled: isAuthenticated && isSearching,
    staleTime: 1000 * 10,
  });

  const orders = isSearching
    ? allQuery.data || []
    : pagedQuery.data?.content || [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter && o.status !== statusFilter) return false;
      if (!q) return true;
      const inOrderNumber = (o.orderNumber || "").toLowerCase().includes(q);
      const inItems = (o.orderItems || []).some((it) =>
        (it.productName || "").toLowerCase().includes(q)
      );
      return inOrderNumber || inItems;
    });
  }, [orders, query, statusFilter]);

  return {
    isAuthenticated,
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    isSearching,
    orders,
    filtered,
    // Query 상태는 mode에 맞는 쪽만 노출
    data: isSearching ? undefined : pagedQuery.data,
    isLoading: isSearching ? allQuery.isLoading : pagedQuery.isLoading,
    isError: isSearching ? allQuery.isError : pagedQuery.isError,
    error: isSearching ? allQuery.error : pagedQuery.error,
    refetch: isSearching ? allQuery.refetch : pagedQuery.refetch,
    isFetching: isSearching ? allQuery.isFetching : pagedQuery.isFetching,
  };
}
