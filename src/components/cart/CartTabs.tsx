"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function CartTabs() {
  const pathname = usePathname();
  const isCart = pathname === "/cart";
  const isWishlist = pathname === "/wishlist";

  return (
    <div className="mb-4 sm:mb-6">
      <div className="inline-flex rounded-xl bg-white border border-slate-200 p-1 shadow-sm">
        <Link
          href="/cart"
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            isCart
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          장바구니
        </Link>
        <Link
          href="/wishlist"
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            isWishlist
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          찜한 상품
        </Link>
      </div>
    </div>
  );
}


