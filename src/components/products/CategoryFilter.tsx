import { Button } from "@/components/ui/Button";
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
    <>
      {/* Mobile Category List (Horizontal Scroll) */}
      <div className="lg:hidden mb-6 -mx-4 px-4">
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          <Button
            variant={selectedCategory === null ? "primary" : "outline"}
            size="sm"
            onClick={() => onCategoryClick(null)}
            className="whitespace-nowrap rounded-full px-4 h-9"
          >
            전체
          </Button>
          {categories.map((category) => (
            <Button
              key={category.categoryId}
              variant={
                selectedCategory === category.categoryId ? "primary" : "outline"
              }
              size="sm"
              onClick={() => onCategoryClick(category.categoryId)}
              className="whitespace-nowrap rounded-full px-4 h-9"
            >
              {category.categoryName}
            </Button>
          ))}
        </div>
      </div>

      {/* Desktop Category Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24">
          <h2 className="text-xl font-bold mb-6 px-2">카테고리</h2>
          <div className="space-y-1">
            <button
              onClick={() => onCategoryClick(null)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl transition-all font-medium text-base",
                selectedCategory === null
                  ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              전체보기
            </button>
            {categories.map((category) => (
              <button
                key={category.categoryId}
                onClick={() => onCategoryClick(category.categoryId)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl transition-all font-medium text-base",
                  selectedCategory === category.categoryId
                    ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {category.categoryName}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

