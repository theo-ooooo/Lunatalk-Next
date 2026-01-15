"use client";

import { useProductList } from "@/hooks/product/useProductList";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import ProductCard from "@/components/product/ProductCard";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Pagination } from "@/components/common/Pagination";

export default function ProductListContent() {
  const {
    categories,
    productsData,
    isLoading,
    selectedCategory,
    handleCategoryClick,
    searchQuery,
    page,
    setPage,
  } = useProductList();

  const products = productsData?.content || [];
  const totalPages = productsData?.totalPages ?? 1;
  const totalElements = productsData?.totalElements ?? products.length;
  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Page Title */}
        <div className="pb-4 border-b border-slate-100">
          <h1 className="text-[18px] md:text-[22px] font-extrabold text-slate-900">
            {searchQuery
              ? `'${searchQuery}' 검색 결과`
              : selectedCategory
              ? safeCategories.find((c) => c.categoryId === selectedCategory)
                  ?.categoryName
              : "전체 상품"}
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1">
            총 {totalElements}개
          </p>
        </div>

        {/* Category chips */}
        <div className="md:hidden">
          <CategoryFilter
            categories={safeCategories}
            selectedCategory={selectedCategory}
            onCategoryClick={handleCategoryClick}
          />
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="py-24 flex justify-center items-center">
            <Loader2 className="w-7 h-7 animate-spin text-slate-400" />
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-8">
              {products.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => {
                setPage(p);
                if (typeof window !== "undefined") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            />
          </>
        ) : (
          <div className="py-24 text-center bg-white border border-slate-200 rounded-xl">
            <p className="text-slate-700 font-semibold mb-2">
              조건에 맞는 상품이 없습니다.
            </p>
            <p className="text-slate-500 text-sm mb-6">
              다른 조건으로 다시 찾아보세요.
            </p>
            <Link
              href="/"
              className="px-5 py-2 border border-slate-300 rounded-full text-sm font-semibold text-slate-800 hover:border-slate-400"
            >
              홈으로 가기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
