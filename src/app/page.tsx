import Link from "next/link";
import { exhibitionApi, categoryApi } from "@/services/api";
import ProductCard from "@/components/product/ProductCard";

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

  return (
    <div className="pb-32 bg-white min-h-screen">
      {/* Categories Section - Clean & Minimal */}
      <section className="py-10 border-b border-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto pb-4 gap-4 md:gap-6 no-scrollbar snap-x">
            {(Array.isArray(categories) ? categories : [])
              .filter((c) => c.visibility === "VISIBLE")
              .map((category) => (
                <Link
                  key={category.categoryId}
                  href={`/products?categoryId=${category.categoryId}`}
                  className="flex-shrink-0 snap-start flex flex-col items-center gap-3 group min-w-[72px]"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-[24px] flex items-center justify-center group-hover:bg-slate-100 group-hover:scale-105 transition-all duration-300 shadow-sm border border-transparent group-hover:border-slate-200">
                    <span className="text-xl md:text-2xl font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                      {category.categoryName.charAt(0)}
                    </span>
                  </div>
                  <span className="text-[13px] md:text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                    {category.categoryName}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Exhibitions Loop */}
      <div className="space-y-0">
        {exhibitionList.length > 0 ? (
          exhibitionList.map((exhibition, index) => {
            const products =
              exhibition.products
                ?.sort((a, b) => a.sortOrder - b.sortOrder)
                .map((item) => item.product) || [];

            return (
              <div key={exhibition.exhibitionId} className="relative">
                {/* Exhibition Banner Removed as per user request */}

                {/* Exhibition Products */}
                <section className="py-12 md:py-16 container mx-auto px-4">
                  <div className="flex items-end justify-between mb-8">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900">
                      {exhibition.title}
                    </h3>
                    <Link
                      href={`/products`}
                      className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      더보기
                    </Link>
                  </div>

                  {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
                      {products.map((product) => (
                        <ProductCard
                          key={product.productId}
                          product={product}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center text-slate-400 bg-gray-50 rounded-[20px] border border-dashed border-gray-200">
                      상품이 준비 중입니다.
                    </div>
                  )}
                </section>

                {/* Spacer between exhibitions */}
                {index < exhibitionList.length - 1 && (
                  <div className="h-4 bg-gray-50/50 w-full border-t border-b border-gray-100/50" />
                )}
              </div>
            );
          })
        ) : (
          <div className="py-32 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
              !
            </div>
            <p className="text-slate-500 font-medium">
              진행 중인 기획전이 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
