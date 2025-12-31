import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApi, orderApi } from "@/services/api";
import {
  Package,
  ShoppingCart,
  Heart,
  FileText,
  Gift,
  Settings,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface QuickMenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
  color: string;
  disabled?: boolean;
}

export function useMyPage() {
  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: authApi.getMe,
  });

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders", 0],
    queryFn: () => orderApi.getOrders({ page: 0, size: 5, sort: ["string"] }),
  });

  const orderStats = useMemo(() => {
    const orders = ordersData?.content || [];
    return {
      total: orders.length,
      paymentCompleted: orders.filter(
        (o) => o.status === "PAYMENT_COMPLETED"
      ).length,
      shipped: orders.filter(
        (o) => o.status === "SHIPPED" || (o.status as string) === "배송중"
      ).length,
      delivered: orders.filter(
        (o) =>
          o.status === "DELIVERED" || (o.status as string) === "배송완료"
      ).length,
    };
  }, [ordersData]);

  const quickMenuItems: QuickMenuItem[] = useMemo(
    () => [
      {
        icon: Package,
        label: "주문내역",
        href: "/mypage",
        color: "bg-blue-50 text-blue-600",
        disabled: false,
      },
      {
        icon: ShoppingCart,
        label: "장바구니",
        href: "/cart",
        color: "bg-purple-50 text-purple-600",
        disabled: false,
      },
      {
        icon: Heart,
        label: "관심상품",
        href: "#",
        color: "bg-pink-50 text-pink-600",
        disabled: true,
      },
      {
        icon: FileText,
        label: "상품문의",
        href: "/inquiries",
        color: "bg-green-50 text-green-600",
        disabled: false,
      },
      {
        icon: Gift,
        label: "쿠폰",
        href: "#",
        color: "bg-orange-50 text-orange-600",
        disabled: true,
      },
      {
        icon: Settings,
        label: "설정",
        href: "/mypage/edit",
        color: "bg-slate-50 text-slate-600",
        disabled: false,
      },
    ],
    []
  );

  return {
    me,
    ordersData,
    isLoading,
    orderStats,
    quickMenuItems,
  };
}
