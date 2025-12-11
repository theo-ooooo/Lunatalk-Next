"use client";

import { useProductList } from "@/hooks/product/useProductList";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import ProductCard from "@/components/product/ProductCard";
import { Loader2 } from "lucide-react";
import Link from "next/link"; // For "홈으로 가기" button if needed, but the main flow uses router from hook
import { use } from "react";

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category: string; search: string }>;
}) {
  const params = use(searchParams);
  const {
    categories,
    productsData,
    isLoading,
    selectedCategory,
    handleCategoryClick,
    searchQuery,
  } = useProductList(params);

  const products = productsData?.content || [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <CategoryFilter
          categories={safeCategories}
          selectedCategory={selectedCategory}
          onCategoryClick={handleCategoryClick}
        />

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-6 lg:mb-8">
            <h1 className="text-xl lg:text-2xl font-bold text-slate-900">
              {searchQuery
                ? `'${searchQuery}' 검색 결과`
                : selectedCategory
                ? safeCategories.find((c) => c.categoryId === selectedCategory)
                    ?.categoryName
                : "전체 상품"}
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              총 {products.length}개의 상품
            </p>
          </div>

          {isLoading ? (
            <div className="py-32 flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 lg:gap-8">
              {products.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-32 text-center bg-slate-50 rounded-2xl">
              <p className="text-slate-500 font-medium mb-4">
                조건에 맞는 상품이 없습니다.
              </p>
              <Link
                href="/"
                className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                홈으로 가기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
