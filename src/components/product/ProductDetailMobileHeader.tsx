"use client";

import Link from "next/link";
import { ChevronLeft, Home, Search, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartCount } from "@/hooks/layout/useCartCount";
import {
  HeaderIconButton,
  HeaderIconLink,
} from "@/components/layout/HeaderIcons";

export default function ProductDetailMobileHeader() {
  const router = useRouter();
  const { cartCount: count } = useCartCount();

  return (
    <div className="md:hidden sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="px-4 h-12 flex items-center justify-between">
        <HeaderIconButton
          onClick={() => router.back()}
          Icon={ChevronLeft}
          ariaLabel="뒤로가기"
        />

        <div className="flex items-center gap-1">
          <HeaderIconLink href="/" Icon={Home} ariaLabel="홈" />
          <HeaderIconLink href="/search" Icon={Search} ariaLabel="검색" />
          <HeaderIconLink
            href="/cart"
            Icon={ShoppingCart}
            ariaLabel="장바구니"
            badgeCount={count}
          />
        </div>
      </div>
    </div>
  );
}
