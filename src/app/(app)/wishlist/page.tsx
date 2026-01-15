"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { productApi } from "@/services/api";
import { CartTabs } from "@/components/cart/CartTabs";
import ProductRow from "@/components/product/ProductRow";
import { Loading } from "@/components/common/Loading";
import { Button } from "@/components/ui/Button";

export default function WishlistPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/wishlist");
    }
  }, [isAuthenticated, router]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products", "likes", "my", 0, 20],
    queryFn: () => productApi.getMyLikedProducts({ page: 0, size: 20 }),
    enabled: isAuthenticated,
  });

  const products = (data?.content || []).filter((p) => p.isLiked !== false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white py-4 sm:py-6 md:py-8">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-xl font-bold text-slate-900">
              찜한 상품
            </h1>
          </div>
          <div className="hidden md:block">
            <CartTabs />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12">
            <div className="py-20 text-center">
              <Loading message="로그인 페이지로 이동 중..." fullScreen={false} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-xl font-bold text-slate-900">
            찜한 상품
          </h1>
        </div>
        <div className="hidden md:block">
          <CartTabs />
        </div>

        {isLoading ? (
          <Loading message="찜한 상품을 불러오는 중..." fullScreen={false} />
        ) : isError ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12">
            <div className="py-20 text-center">
              <p className="text-slate-500 mb-4">
                찜한 상품을 불러오는 중 오류가 발생했습니다.
              </p>
              <Button onClick={() => refetch()}>다시 시도</Button>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12">
            <div className="py-20 text-center">
              <p className="text-lg font-medium text-slate-700 mb-2">
                찜한 상품이 없습니다.
              </p>
              <p className="text-sm text-slate-500 mb-6">
                마음에 드는 상품을 찜해보세요.
              </p>
              <Button variant="primary" onClick={() => router.push("/products")}>
                상품 보러 가기
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl px-4 sm:px-6">
            {products.map((product) => (
              <ProductRow key={product.productId} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


