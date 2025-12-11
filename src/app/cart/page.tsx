"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/services/api";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { Trash2, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOrderStore } from "@/store/useOrderStore";

export default function CartPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setOrderItems } = useOrderStore();

  // 선택된 장바구니 아이템 ID들
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data: rawCartItems, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCartItems,
  });

  const cartItems = Array.isArray(rawCartItems) ? rawCartItems : [];

  const deleteMutation = useMutation({
    mutationFn: cartApi.deleteCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // 수량 변경 API가 있다면 연결, 없다면 구현 생략 또는 별도 처리
  // 문서상 PUT /cart-items/{id} 존재함
  // const updateMutation = useMutation(...)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(cartItems.map((item) => item.cartItemId));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleOrder = () => {
    if (selectedIds.length === 0) {
      alert("주문할 상품을 선택해주세요.");
      return;
    }

    const itemsToOrder = cartItems
      .filter((item) => selectedIds.includes(item.cartItemId))
      .map((item) => ({
        productId: item.product.productId,
        quantity: item.quantity,
        productName: item.product.name, // or productName
        price: item.product.price,
        imageUrl: item.product.images?.[0]?.imageUrl,
      }));

    setOrderItems(itemsToOrder);
    router.push("/order");
  };

  if (isLoading)
    return <div className="py-20 text-center">장바구니를 불러오는 중...</div>;

  const totalAmount = cartItems
    .filter((item) => selectedIds.includes(item.cartItemId))
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">장바구니</h1>

      {cartItems.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart List */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b">
              <input
                type="checkbox"
                className="w-5 h-5"
                checked={selectedIds.length === cartItems.length}
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
                    className="w-5 h-5 mt-2"
                    checked={selectedIds.includes(item.cartItemId)}
                    onChange={(e) =>
                      handleSelect(item.cartItemId, e.target.checked)
                    }
                  />
                  <div className="w-24 h-24 bg-slate-100 rounded-md overflow-hidden flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImageUrl(item.product.images?.[0]?.imageUrl)}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium line-clamp-2">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {formatPrice(item.product.price)}원
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span>수량: {item.quantity}개</span>
                        {/* 수량 변경 버튼 UI만 배치 (기능은 API 연결 필요) */}
                      </div>
                      <button
                        onClick={() => handleDelete(item.cartItemId)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
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
                <div className="flex justify-between">
                  <span className="text-slate-600">총 상품금액</span>
                  <span className="font-bold">
                    {formatPrice(totalAmount)}원
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">배송비</span>
                  <span className="font-bold">0원</span>
                </div>
              </div>
              <div className="border-t pt-4 mb-6 flex justify-between items-center">
                <span className="font-bold text-lg">총 결제금액</span>
                <span className="font-bold text-xl text-blue-600">
                  {formatPrice(totalAmount)}원
                </span>
              </div>
              <button
                onClick={handleOrder}
                disabled={selectedIds.length === 0}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                {selectedIds.length}개 상품 주문하기
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-32 text-center bg-slate-50 rounded-xl">
          <p className="text-slate-500 mb-4">
            장바구니에 담긴 상품이 없습니다.
          </p>
          <Link
            href="/products"
            className="inline-block bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800"
          >
            쇼핑하러 가기
          </Link>
        </div>
      )}
    </div>
  );
}
