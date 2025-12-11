import Link from "next/link";
import { productApi, categoryApi } from "@/services/api";
import ProductCard from "@/components/product/ProductCard";
import { ChevronRight, ChevronLeft } from "lucide-react";
import clsx from "clsx";

// 메타데이터 생성
export const metadata = {
  title: "상품 목록 - LUNATALK",
  description: "루나톡의 다양한 상품을 만나보세요.",
};

interface Props {
  searchParams: Promise<{
    page?: string;
    categoryId?: string;
    sort?: string;
    search?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  // 파라미터 파싱 (Next.js 15: await 필수)
  const params = await searchParams;
  const page = Number(params.page) || 0;
  const size = 12;
  const categoryId = params.categoryId ? Number(params.categoryId) : undefined;

  // 병렬 데이터 페칭
  const [categories, productsData] = await Promise.all([
    categoryApi.getCategories().catch(() => []),
    productApi
      .getProducts({
        page,
        size,
      })
      .catch(() => ({
        content: [],
        totalPages: 0,
        number: 0,
        first: true,
        last: true,
      })),
  ]);

  const categoryList = Array.isArray(categories) ? categories : [];
  let products = productsData?.content || [];
  let totalPages = productsData?.totalPages || 0;

  // 만약 categoryId가 있다면 해당 카테고리 상품 API를 호출해서 교체
  if (categoryId) {
    try {
      const categoryData = await categoryApi.getCategoryProducts(categoryId);
      if (categoryData && categoryData.products) {
        products = categoryData.products;
        totalPages = 1;
      }
    } catch (e) {
      console.error("Failed to fetch category products:", e);
      products = [];
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb - Clean text style */}
        <div className="flex items-center text-xs md:text-sm text-slate-400 mb-6 md:mb-10 font-medium">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            HOME
          </Link>
          <ChevronRight className="w-3 h-3 mx-2 text-slate-300" />
          <span className="text-slate-800">
            {categoryId
              ? categoryList.find((c) => c.categoryId === categoryId)
                  ?.categoryName
              : "ALL PRODUCTS"}
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Sidebar Filters - Modern Vertical List (Desktop) & Horizontal Scroll (Mobile) */}
          <aside className="w-full md:w-56 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="font-bold text-xl mb-6 text-slate-900 hidden md:block px-2">
                Category
              </h3>
              
              {/* Mobile: Horizontal Scrollable List */}
              <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar flex gap-2 snap-x">
                <Link
                  href="/products"
                  className={clsx(
                    "flex-shrink-0 snap-start px-4 py-2 rounded-full text-sm font-medium transition-all border",
                    !categoryId
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                  )}
                >
                  전체보기
                </Link>
                {categoryList
                  .filter((c) => c.visibility === "VISIBLE")
                  .map((category) => (
                    <Link
                      key={category.categoryId}
                      href={`/products?categoryId=${category.categoryId}`}
                      className={clsx(
                        "flex-shrink-0 snap-start px-4 py-2 rounded-full text-sm font-medium transition-all border",
                        categoryId === category.categoryId
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                      )}
                    >
                      {category.categoryName}
                    </Link>
                  ))}
              </div>

              {/* Desktop: Clean Vertical List */}
              <ul className="hidden md:space-y-1 md:block">
                <li>
                  <Link
                    href="/products"
                    className={clsx(
                      "block px-4 py-2.5 rounded-lg transition-all text-[15px] font-medium",
                      !categoryId
                        ? "bg-slate-50 text-slate-900 font-bold"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    전체보기
                  </Link>
                </li>
                {categoryList
                  .filter((c) => c.visibility === "VISIBLE")
                  .map((category) => (
                    <li key={category.categoryId}>
                      <Link
                        href={`/products?categoryId=${category.categoryId}`}
                        className={clsx(
                          "block px-4 py-2.5 rounded-lg transition-all text-[15px] font-medium",
                          categoryId === category.categoryId
                            ? "bg-slate-50 text-slate-900 font-bold"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        {category.categoryName}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                 {categoryId
                    ? categoryList.find((c) => c.categoryId === categoryId)
                        ?.categoryName
                    : "전체 상품"}
              </h1>
              <span className="text-slate-400 text-sm font-medium">
                <strong className="text-slate-900">{products.length}</strong> items
              </span>
            </div>

            {products && products.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
                {products.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-40 text-center">
                <p className="text-slate-400 font-medium mb-4">
                  등록된 상품이 없습니다.
                </p>
                <Link
                  href="/"
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  홈으로 가기
                </Link>
              </div>
            )}

            {/* Pagination (전체 상품일 때만 노출) */}
            {!categoryId && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16">
                <Link
                  href={`/products?page=${Math.max(0, page - 1)}`}
                  className={clsx(
                    "p-2 rounded-full border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all",
                    page === 0 && "pointer-events-none opacity-50"
                  )}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Link>
                <span className="text-sm font-bold text-slate-900 px-4">
                  {page + 1} <span className="text-slate-300 font-normal">/</span> {totalPages}
                </span>
                <Link
                  href={`/products?page=${Math.min(totalPages - 1, page + 1)}`}
                  className={clsx(
                    "p-2 rounded-full border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all",
                    page >= totalPages - 1 && "pointer-events-none opacity-50"
                  )}
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
