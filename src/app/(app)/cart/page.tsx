"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/cart/useCart";
import { CartItem } from "@/components/cart/CartItem";
import { Loading } from "@/components/common/Loading";
import { QueryErrorBoundary } from "@/components/common/QueryErrorBoundary";
import { ShoppingCart, CreditCard } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { CartTabs } from "@/components/cart/CartTabs";

function CartContent() {
  const {
    cartItems,
    selectedIds,
    isOrdering,
    totalAmount,
    handleSelectAll,
    handleSelect,
    handleDelete,
    handleOrder,
  } = useCart();

  return (
    <>
      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          {/* Cart List */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 lg:p-5">
              <div className="flex items-center gap-2 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-200">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 text-slate-900 flex-shrink-0" />
                <h2 className="text-base sm:text-lg lg:text-base font-bold text-slate-900">
                  담은 상품
                </h2>
                <span className="ml-auto text-xs sm:text-sm lg:text-xs text-slate-500">
                  총 {cartItems.length}개
                </span>
              </div>

              {/* 전체 선택 */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <input
                  type="checkbox"
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  checked={
                    cartItems.length > 0 &&
                    selectedIds.length === cartItems.length
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                <span className="text-sm sm:text-base lg:text-sm font-medium text-slate-700">
                  전체 선택 ({selectedIds.length}/{cartItems.length})
                </span>
              </div>

              <div className="divide-y divide-slate-200">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.cartItemId}
                    item={item}
                    isSelected={selectedIds.includes(item.cartItemId)}
                    onSelect={(checked) => handleSelect(item.cartItemId, checked)}
                    onDelete={() => handleDelete(item.cartItemId)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 sticky top-24 overflow-hidden">
              <div className="px-4 py-4 border-b border-slate-200 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-900 flex-shrink-0" />
                <h2 className="text-sm font-extrabold text-slate-900">
                  결제 예정 금액
                </h2>
              </div>

              <div className="px-4 py-4 space-y-2">
                <div className="flex justify-between text-sm text-slate-700">
                  <span>상품금액</span>
                  <span className="font-semibold">
                    {formatPrice(totalAmount)}원
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-700">
                  <span>배송비</span>
                  <span className="font-semibold">0원</span>
                </div>
              </div>

              <div className="px-4 py-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm font-extrabold text-slate-900">
                  총 결제금액
                </span>
                <span className="text-lg font-extrabold text-slate-900">
                  {formatPrice(totalAmount)}원
                </span>
              </div>

              <div className="p-4">
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  onClick={handleOrder}
                  disabled={selectedIds.length === 0 || isOrdering}
                  isLoading={isOrdering}
                  className="text-sm"
                >
                  {selectedIds.length}개 상품 주문하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12">
          <div className="py-20 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-medium text-slate-700 mb-2">
              장바구니에 담긴 상품이 없습니다.
            </p>
            <p className="text-sm text-slate-500 mb-6">
              원하는 상품을 장바구니에 담아보세요.
            </p>
            <Link href="/products">
              <Button variant="primary" size="lg">
                쇼핑하러 가기
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default function CartPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/cart");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white py-4 sm:py-6 md:py-8">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-xl font-bold text-slate-900">
              장바구니
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

  const cartHook = useCart();

  return (
    <div className="min-h-screen bg-white py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-xl font-bold text-slate-900">
            장바구니
          </h1>
        </div>
        <div className="hidden md:block">
          <CartTabs />
        </div>
        {cartHook.isLoading ? (
          <Loading message="장바구니를 불러오는 중..." fullScreen={false} />
        ) : (
          <QueryErrorBoundary
            fallback={
              <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12">
                <div className="py-20 text-center">
                  <p className="text-slate-500 mb-4">
                    장바구니를 불러오는 중 오류가 발생했습니다.
                  </p>
                  <Button onClick={() => window.location.reload()}>
                    다시 시도
                  </Button>
                </div>
              </div>
            }
          >
            <CartContent />
          </QueryErrorBoundary>
        )}
      </div>
    </div>
  );
}


