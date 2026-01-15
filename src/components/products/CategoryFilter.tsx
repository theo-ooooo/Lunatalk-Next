import { Category } from "@/types/api";
import { cn } from "@/lib/utils";
import React from "react";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: number | null;
  onCategoryClick: (id: number | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryClick,
}: CategoryFilterProps) {
  return (
    <div className="mb-3 -mx-4 px-4">
      {/* Musinsa-like scroll tabs */}
      <div className="flex gap-5 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: null as number | null, label: "전체" },
          ...categories.map((c) => ({
            id: c.categoryId,
            label: c.categoryName,
          })),
        ].map(({ id, label }) => {
          const active = selectedCategory === id;
          return (
            <button
              key={id ?? "all"}
              type="button"
              onClick={() => onCategoryClick(id)}
              className={cn(
                "relative whitespace-nowrap py-1.5 text-[12px] transition-colors",
                active
                  ? "text-slate-900 font-semibold"
                  : "text-slate-500 font-medium hover:text-slate-800"
              )}
              aria-current={active ? "page" : undefined}
            >
              {label}
              <span
                className={cn(
                  "pointer-events-none absolute left-0 right-0 bottom-0 h-[2px] rounded-full transition-opacity",
                  active ? "bg-slate-900 opacity-100" : "opacity-0"
                )}
                aria-hidden
              />
            </button>
          );
        })}
      </div>
      <div className="mt-1 h-px bg-slate-200/70" />
    </div>
  );
}
