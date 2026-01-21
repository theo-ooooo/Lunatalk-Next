import { exhibitionApi, productApi, categoryApi } from "@/services/api";
import ProductCard from "@/components/product/ProductCard";
import ProductGrid from "@/components/products/ProductGrid";
import Link from "next/link";
import type { Metadata } from "next";
import type { Product } from "@/types/api";

// Production 환경에서만 SEO 메타데이터 적용
const isProduction = process.env.NODE_ENV === "production";

export const metadata: Metadata = isProduction
  ? {
      title: "홈",
      description:
        "루나톡에서 다양한 상품과 기획전을 만나보세요. 일상의 즐거움을 선사하는 쇼핑몰입니다.",
      openGraph: {
        title: "LUNATALK - 일상의 즐거움",
        description: "루나톡에서 다양한 상품과 기획전을 만나보세요.",
        url: "/",
      },
    }
  : {
      title: "홈",
      description: "루나톡 쇼핑몰입니다.",
      robots: {
        index: false,
        follow: false,
      },
    };

// 메인 페이지는 서버 컴포넌트입니다.
export default async function Home() {
  // 병렬 데이터 페칭
  const [exhibitions, categories] = await Promise.all([
    exhibitionApi.getExhibitions().catch(() => []),
    categoryApi.getCategories().catch(() => []),
  ]);

  // 노출 가능한 기획전 필터링
  const exhibitionList = (Array.isArray(exhibitions) ? exhibitions : []).filter(
    (ex) => ex.visibility === "VISIBLE"
  );

  // 노출 가능한 카테고리 필터링 (상품이 있는 카테고리만)
  const visibleCategories = (Array.isArray(categories) ? categories : [])
    .filter((c) => c.visibility === "VISIBLE" && c.productCount > 0)
    .slice(0, 4); // 최대 4개 카테고리만 표시

  // 각 카테고리별 상품 가져오기
  const categoryProductsPromises = visibleCategories.map((category) =>
    categoryApi
      .getCategoryProducts(category.categoryId)
      .then((data) => ({
        category,
        products: (data?.products || []).slice(0, 5), // 카테고리당 5개 상품
      }))
      .catch(() => ({ category, products: [] }))
  );

  const categoryProductsList = await Promise.all(categoryProductsPromises);

  return (
    <div className="pb-32 bg-white min-h-screen">
      {/* 히어로 배너 섹션 */}
      <section className="relative w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight tracking-tight" style={{ letterSpacing: '-0.05em' }}>
              일상의 즐거움,
              <br />
              <span className="bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                루나톡에서
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed" style={{ letterSpacing: '-0.03em' }}>
              특별한 순간을 만들어줄 다양한 상품들을 만나보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center" style={{ letterSpacing: '-0.03em' }}>
              <Link
                href="/products"
                className="px-8 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
              >
                상품 둘러보기
              </Link>
              <Link
                href="/search"
                className="px-8 py-3 bg-white text-slate-900 rounded-lg font-semibold border-2 border-slate-200 hover:border-slate-300 transition-colors"
              >
                상품 검색하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* 카테고리별 추천 상품 섹션 */}
        {categoryProductsList.length > 0 && (
          <div className="pt-12 md:pt-16">
            {categoryProductsList.map(({ category, products }) => {
              if (products.length === 0) return null;

              return (
                <div key={category.categoryId} className="mb-12 md:mb-16">
                  <ProductGrid
                    title={category.categoryName}
                    subtitle={`${category.productCount}개의 상품이 준비되어 있습니다`}
                    moreHref={`/products?categoryId=${category.categoryId}`}
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-6">
                      {products.map((product: Product) => (
                        <ProductCard
                          key={product.productId}
                          product={product}
                        />
                      ))}
                    </div>
                  </ProductGrid>
                </div>
              );
            })}
          </div>
        )}

        {/* Exhibitions (keep existing business data, as additional sections) */}
        <div className="border-t border-slate-200 bg-white mt-8 md:mt-12">
          {exhibitionList.length > 0 ? (
            exhibitionList.map((exhibition) => {
              const products =
                exhibition.products
                  ?.sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((item) => item.product) || [];

              return (
                <ProductGrid
                  key={exhibition.exhibitionId}
                  title={exhibition.title}
                  subtitle={exhibition.description}
                  moreHref="/products"
                >
                  {products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-6">
                      {products.map((product) => (
                        <ProductCard
                          key={product.productId}
                          product={product}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="py-16 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
                      상품이 준비 중입니다.
                    </div>
                  )}
                </ProductGrid>
              );
            })
          ) : (
            <div className="py-20 md:py-32">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 md:w-24 md:h-24 mb-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 md:w-12 md:h-12 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-700 mb-2">
                  진행중인 기획전이 없습니다
                </h3>
                <p className="text-sm md:text-base text-slate-500 max-w-md">
                  새로운 기획전을 준비 중입니다.
                  <br />
                  곧 만나보실 수 있습니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
