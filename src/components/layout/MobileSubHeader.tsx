"use client";

import { ChevronLeft } from "lucide-react";
import { Search, ShoppingCart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "@/services/api";
import { useEffect, useState } from "react";
import { useCartCount } from "@/hooks/layout/useCartCount";
import {
  HeaderIconButton,
  HeaderIconLink,
} from "@/components/layout/HeaderIcons";

function baseTitle(pathname: string) {
  if (pathname === "/cart") return "장바구니";
  if (pathname === "/wishlist") return "관심상품";
  if (pathname === "/mypage") return "마이페이지";
  if (pathname === "/orders") return "주문 내역";
  if (pathname.startsWith("/orders/")) return "주문 상세";
  if (pathname === "/inquiries") return "문의 내역";
  if (pathname.startsWith("/inquiries/")) return "문의";
  if (pathname === "/products") return "상품";
  if (pathname.startsWith("/products/")) return "상품 상세";
  if (pathname === "/search") return "검색";
  return "LUNATALK";
}

export default function MobileSubHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount } = useCartCount();

  const [{ categoryId, search }, setQueryState] = useState<{
    categoryId: string | null;
    search: string | null;
  }>({ categoryId: null, search: null });

  // useSearchParams는 /_not-found prerender에서 Suspense 요구가 생겨서,
  // 모바일 서브헤더에서는 클라이언트에서만 query string을 직접 파싱한다.
  useEffect(() => {
    // effect 바디에서 setState를 동기 호출하면 cascading render 경고가 날 수 있어
    // 업데이트는 비동기 콜백으로 한 번만 수행한다.
    const timer = window.setTimeout(() => {
      if (pathname !== "/products") {
        setQueryState({ categoryId: null, search: null });
        return;
      }

      const sp = new URLSearchParams(window.location.search);
      setQueryState({
        categoryId: sp.get("categoryId"),
        search: sp.get("search"),
      });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getCategories,
    staleTime: 1000 * 60 * 5,
    enabled: pathname === "/products" && !!categoryId,
  });

  const categoryName =
    categoryId && Array.isArray(categories)
      ? categories.find((c) => String(c.categoryId) === String(categoryId))
          ?.categoryName
      : null;

  const title =
    pathname === "/products" && search
      ? `'${search}' 검색`
      : pathname === "/products" && categoryName
      ? categoryName
      : baseTitle(pathname);

  return (
    <div className="md:hidden sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="px-4 h-12 flex items-center justify-between">
        <div className="min-w-0 flex items-center gap-2">
          <HeaderIconButton
            onClick={() => router.back()}
            Icon={ChevronLeft}
            ariaLabel="뒤로가기"
          />
          <div className="text-[15px] font-extrabold text-slate-900 truncate max-w-[58vw]">
            {title}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <HeaderIconLink href="/search" Icon={Search} ariaLabel="검색" />
          <HeaderIconLink
            href="/cart"
            Icon={ShoppingCart}
            ariaLabel="장바구니"
            badgeCount={cartCount}
          />
        </div>
      </div>
    </div>
  );
}
