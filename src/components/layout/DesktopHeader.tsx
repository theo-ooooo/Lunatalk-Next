"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, LogOut, ShoppingCart, User } from "lucide-react";
import { Suspense } from "react";
import CategoryMenu from "@/components/layout/CategoryMenu";
import ProductSearchInput from "@/components/product/ProductSearchInput";
import { useHeaderData } from "@/hooks/layout/useHeaderData";
import {
  HeaderIconButton,
  HeaderIconLink,
} from "@/components/layout/HeaderIcons";

export default function DesktopHeader() {
  const { isAuthenticated, cartCount, categoryList, handleLogout } =
    useHeaderData();

  return (
    <header className="hidden md:block sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      <div className="container mx-auto px-4">
        {/* Top row */}
        <div className="h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="홈">
            <Image
              src="/logo.png"
              alt="LUNATALK"
              width={140}
              height={44}
              className="object-contain h-9 w-auto"
              priority
            />
          </Link>

          <div className="flex items-center gap-2">
            <HeaderIconLink
              href="/wishlist"
              Icon={Heart}
              ariaLabel="위시리스트"
              title="위시리스트"
            />
            <HeaderIconLink
              href="/cart"
              Icon={ShoppingCart}
              ariaLabel="장바구니"
              title="장바구니"
              badgeCount={cartCount}
            />

            {isAuthenticated ? (
              <>
                <HeaderIconLink
                  href="/mypage"
                  Icon={User}
                  ariaLabel="마이페이지"
                  title="마이페이지"
                />
                <HeaderIconButton
                  onClick={handleLogout}
                  Icon={LogOut}
                  ariaLabel="로그아웃"
                  title="로그아웃"
                  className="text-slate-700"
                  iconClassName="text-slate-700"
                />
              </>
            ) : (
              <HeaderIconLink
                href="/login"
                Icon={User}
                ariaLabel="로그인"
                title="로그인"
              />
            )}
          </div>
        </div>

        {/* Search row */}
        <div className="pb-4">
          <Suspense
            fallback={
              <div className="w-full h-10 rounded-md border border-slate-200 bg-white" />
            }
          >
            <ProductSearchInput variant="mobile" />
          </Suspense>
        </div>
      </div>

      {/* Category row */}
      <div className="border-t border-slate-100 bg-white">
        <div className="container mx-auto px-4">
          <CategoryMenu categories={categoryList} className="py-1" />
        </div>
      </div>
    </header>
  );
}
