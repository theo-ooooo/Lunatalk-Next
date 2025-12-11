import ProductSearchInput from "@/components/product/ProductSearchInput";
import ProductCard from "@/components/product/ProductCard";
import { productApi } from "@/services/api";
import Link from "next/link";

import { Product } from "@/types/api"; // Product import 추가

interface Props {
  searchParams: Promise<{
    q?: string;
  }>;
}

// 검색 페이지는 항상 동적으로 렌더링되어야 함 (쿼리 파라미터에 따라 다름)
export const dynamic = "force-dynamic";

export const metadata = {
  title: "검색 - LUNATALK",
  description: "원하는 상품을 검색해보세요.",
};

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const searchQuery = q || "";

  let products: Product[] = []; // 타입 명시
  let isSearched = false;

  if (searchQuery) {
    isSearched = true;
    try {
      const response = await productApi.getProducts({
        page: 0,
        size: 100, // 검색이니까 좀 많이
        productName: searchQuery, // API 파라미터명 수정 (search -> productName)
      });
      products = response.content || [];
    } catch (error) {
      console.error("Search failed:", error);
      products = [];
    }
  }

  // 추천 검색어 (하드코딩 예시)
  const recommendedKeywords = ["신상품", "베스트", "특가", "여름"];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        {/* Search Header */}
        <div className="mb-12">
          <h1 className="text-2xl font-bold mb-6 text-slate-900">상품 검색</h1>
          <ProductSearchInput />

          {/* Recommended Keywords */}
          {!isSearched && (
            <div className="mt-6">
              <span className="text-sm font-bold text-slate-400 mr-3">
                추천 검색어
              </span>
              <div className="inline-flex flex-wrap gap-2">
                {recommendedKeywords.map((keyword) => (
                  <Link
                    key={keyword}
                    href={`/search?q=${encodeURIComponent(keyword)}`}
                    className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    {keyword}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {isSearched && (
          <div>
            <h2 className="text-lg font-bold mb-6 text-slate-900">
              "{searchQuery}" 검색 결과{" "}
              <span className="text-slate-400 font-normal">
                ({products.length})
              </span>
            </h2>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
                {products.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-32 text-center flex flex-col items-center justify-center bg-slate-50 rounded-2xl">
                <div className="text-4xl mb-4">🤔</div>
                <p className="text-slate-500 font-medium text-lg mb-2">
                  검색 결과가 없습니다.
                </p>
                <p className="text-slate-400 text-sm">
                  다른 키워드로 검색해보세요.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
