"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { SummaryRow } from "@/components/ui/SummaryRow";
import { useCart } from "@/hooks/cart/useCart";
import { CartItem } from "@/components/cart/CartItem";

export default function CartPage() {
  const {
    cartItems,
    isLoading,
    isAuthenticated,
    mounted,
    selectedIds,
    isOrdering,
    totalAmount,
    handleSelectAll,
    handleSelect,
    handleDelete,
    handleOrder,
  } = useCart();

  if (!mounted) return null;

  if (isLoading && isAuthenticated)
    return <div className="py-20 text-center">장바구니를 불러오는 중...</div>;

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">장바구니</h1>

        {isAuthenticated ? (
          cartItems.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart List */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                    checked={
                      cartItems.length > 0 &&
                      selectedIds.length === cartItems.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                  <span className="font-medium">
                    전체 선택 ({selectedIds.length}/{cartItems.length})
                  </span>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.cartItemId}
                      item={item}
                      isSelected={selectedIds.includes(item.cartItemId)}
                      onSelect={(checked) =>
                        handleSelect(item.cartItemId, checked)
                      }
                      onDelete={() => handleDelete(item.cartItemId)}
                    />
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="w-full lg:w-80 flex-shrink-0">
                <div className="bg-slate-50 p-6 rounded-xl sticky top-24">
                  <h3 className="font-bold text-lg mb-4">결제 예정 금액</h3>
                  <div className="space-y-2 mb-6">
                    <SummaryRow
                      label="총 상품금액"
                      value={`${formatPrice(totalAmount)}원`}
                    />
                    <SummaryRow label="배송비" value="0원" />
                  </div>
                  <div className="border-t pt-4 mb-6">
                    <SummaryRow
                      label="총 결제금액"
                      value={`${formatPrice(totalAmount)}원`}
                      isTotal
                    />
                  </div>
                  <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    onClick={handleOrder}
                    disabled={selectedIds.length === 0 || isOrdering}
                    isLoading={isOrdering}
                  >
                    {selectedIds.length}개 상품 주문하기
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-32 text-center bg-slate-50 rounded-xl">
              <p className="text-slate-500 mb-4">
                장바구니에 담긴 상품이 없습니다.
              </p>
              <Link href="/products" className="inline-block">
                <Button variant="primary">쇼핑하러 가기</Button>
              </Link>
            </div>
          )
        ) : (
          <div className="py-20 text-center">
            {/* 비로그인 상태일 때는 내용을 숨기거나 간단한 안내만 표시 (모달이 뜸) */}
          </div>
        )}
      </div>
    </>
  );
}
