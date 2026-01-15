"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Search, Tag, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  // 무신사 스타일: 브랜드/검색/홈/좋아요/마이
  { href: "/products", label: "브랜드", Icon: Tag },
  { href: "/search", label: "검색", Icon: Search },
  { href: "/", label: "홈", Icon: Home },
  { href: "/wishlist", label: "좋아요", Icon: Heart },
  { href: "/mypage", label: "마이", Icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-slate-200 bg-white">
      {/* safe area */}
      <div className="pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-6xl px-4">
          <div className="h-14 grid grid-cols-5">
            {items.map(({ href, label, Icon }) => {
              const active =
                href === "/"
                  ? pathname === "/"
                  : pathname === href || pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 text-[11px] font-semibold",
                    active ? "text-slate-900" : "text-slate-500"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      active ? "stroke-[2]" : "stroke-[1.75]"
                    )}
                  />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
