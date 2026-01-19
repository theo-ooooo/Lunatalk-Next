import ProductSearchInput from "@/components/product/ProductSearchInput";
import ProductCard from "@/components/product/ProductCard";
import { productApi } from "@/services/api";
import Link from "next/link";

import { Product } from "@/types/api";
import { Suspense } from "react";

interface Props {
  searchParams: Promise<{
    q?: string;
  }>;
}

export const dynamic = "force-dynamic";

// Production 환경에서만 SEO 메타데이터 적용
const isProduction = process.env.NODE_ENV === "production";

export const metadata = isProduction
  ? {
      title: "검색",
      description:
        "원하는 상품을 검색해보세요. 루나톡에서 다양한 상품을 찾아보세요.",
      robots: {
        index: true,
        follow: true,
      },
    }
  : {
      title: "검색",
      description: "원하는 상품을 검색해보세요.",
      robots: {
        index: false,
        follow: false,
      },
    };

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const searchQuery = q || "";

  let products: Product[] = [];
  let isSearched = false;

  if (searchQuery) {
    isSearched = true;
    try {
      const response = await productApi.getProducts({
        page: 0,
        size: 100,
        productName: searchQuery,
      });
      products = response.content || [];
    } catch (error) {
      console.error("Search failed:", error);
      products = [];
    }
  }

  const recommendedKeywords = ["신상품", "베스트", "특가", "여름"];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-6xl">
        {/* Search input */}
        <div className="pb-3 md:pb-5 border-b border-slate-100">
          <Suspense
            fallback={
              <div className="w-full h-10 rounded-md border border-slate-200 bg-white" />
            }
          >
            <ProductSearchInput variant="mobile" autoFocus={false} />
          </Suspense>

          {/* Recommended Keywords (when empty) */}
          {!isSearched && (
            <div className="mt-3">
              <div className="text-[12px] font-semibold text-slate-500 mb-2">
                추천 검색어
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {recommendedKeywords.map((keyword) => (
                  <Link
                    key={keyword}
                    href={`/search?q=${encodeURIComponent(keyword)}`}
                    className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-slate-200/70 text-[12px] font-medium text-slate-700 hover:border-slate-400 hover:text-slate-900"
                  >
                    {keyword}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {isSearched && (
          <div>
            <div className="pt-4 md:pt-6 pb-3 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[13px] md:text-[14px] font-semibold text-slate-900 truncate">
                  “{searchQuery}”
                </div>
                <div className="mt-0.5 text-[12px] text-slate-500">
                  검색 결과{" "}
                  <span className="font-semibold text-slate-900">
                    {products.length}
                  </span>
                  개
                </div>
              </div>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-8">
                {products.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-white border border-slate-200 rounded-xl">
                <p className="text-slate-900 font-semibold text-sm mb-1">
                  검색 결과가 없습니다.
                </p>
                <p className="text-slate-500 text-[12px]">
                  다른 키워드로 다시 검색해보세요.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


