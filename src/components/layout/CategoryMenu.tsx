"use client";

import Link from "next/link";
import { Category } from "@/types/api";
import { cn } from "@/lib/utils";

interface CategoryMenuProps {
  categories: Category[];
  className?: string;
  variant?: "bar" | "chips";
}

export default function CategoryMenu({
  categories,
  className,
  variant = "bar",
}: CategoryMenuProps) {
  const visible = (Array.isArray(categories) ? categories : []).filter(
    (c) => c.visibility === "VISIBLE"
  );

  if (visible.length === 0) return null;

  if (variant === "chips") {
    return (
      <div className={cn("flex gap-2 overflow-x-auto no-scrollbar", className)}>
        {visible.map((c) => (
          <Link
            key={c.categoryId}
            href={`/products?categoryId=${c.categoryId}`}
            className="shrink-0 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:border-slate-400 hover:text-slate-900 bg-white"
          >
            {c.categoryName}
          </Link>
        ))}
      </div>
    );
  }

  // Naver Shopping 느낌의 가로 카테고리 바
  return (
    <nav
      className={cn(
        "flex items-center gap-0 overflow-x-auto no-scrollbar text-[13px] font-semibold text-slate-700",
        className
      )}
    >
      {visible.map((c, idx) => (
        <div key={c.categoryId} className="flex items-center shrink-0">
          <Link
            href={`/products?categoryId=${c.categoryId}`}
            className="px-3 py-2 hover:text-slate-900"
          >
            {c.categoryName}
          </Link>
          {idx < visible.length - 1 && (
            <span className="w-px h-3 bg-slate-200" aria-hidden />
          )}
        </div>
      ))}
    </nav>
  );
}


