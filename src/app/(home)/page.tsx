import { exhibitionApi, productApi } from "@/services/api";
import ProductCard from "@/components/product/ProductCard";
import ProductGrid from "@/components/products/ProductGrid";

// 메인 페이지는 서버 컴포넌트입니다.
export default async function Home() {
  // 병렬 데이터 페칭 (기존 API 유지)
  const [exhibitions] = await Promise.all([
    exhibitionApi.getExhibitions().catch(() => []),
  ]);

  // 노출 가능한 기획전 필터링
  const exhibitionList = (Array.isArray(exhibitions) ? exhibitions : []).filter(
    (ex) => ex.visibility === "VISIBLE"
  );

  return (
    <div className="pb-32 bg-white min-h-screen">
      {/* Exhibitions (keep existing business data, as additional sections) */}
      {exhibitionList.length > 0 && (
        <div className="border-t border-slate-200 bg-white">
          <div className="container mx-auto px-4">
            {exhibitionList.map((exhibition) => {
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
            })}
          </div>
        </div>
      )}
    </div>
  );
}
