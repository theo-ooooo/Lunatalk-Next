"use client";

import Link from "next/link";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SummaryRow } from "@/components/ui/SummaryRow";
import { useCart } from "@/hooks/cart/useCart";

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
                    <div
                      key={item.cartItemId}
                      className="flex gap-4 p-4 border rounded-lg bg-white"
                    >
                      <input
                        type="checkbox"
                        className="w-5 h-5 mt-2 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                        checked={selectedIds.includes(item.cartItemId)}
                        onChange={(e) =>
                          handleSelect(item.cartItemId, e.target.checked)
                        }
                      />
                      <div className="w-24 h-24 bg-slate-100 rounded-md overflow-hidden flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getImageUrl(item.product.images?.[0]?.imagePath)}
                          alt={
                            item.product.name ||
                            item.product.productName ||
                            "상품 이미지"
                          }
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-medium line-clamp-2">
                            {item.product.name || item.product.productName}
                          </h3>
                          <p className="text-sm text-slate-500 mt-1">
                            {formatPrice(item.product.price)}원
                          </p>

                          {/* 상품 옵션 (Colors) 표시 */}
                          {item.product.colors &&
                            item.product.colors.length > 0 && (
                              <div className="mt-2 flex items-center gap-2">
                                <span className="text-xs text-slate-400 font-medium">
                                  옵션:
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {item.product.colors.map((color, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded-md border border-slate-100"
                                    >
                                      {color}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span>수량: {item.quantity}개</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.cartItemId)}
                            className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
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
