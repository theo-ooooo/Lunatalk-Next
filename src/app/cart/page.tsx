"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi, orderApi } from "@/services/api";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOrderStore } from "@/store/useOrderStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setOrderItems } = useOrderStore();
  const { isAuthenticated } = useAuthStore();
  const { openModal, closeModal } = useModalStore();

  const [mounted, setMounted] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 로그인 유도 모달 열기
  const showLoginModal = () => {
    openModal({
      title: "로그인 필요",
      content: (
        <>
          <p>장바구니는 로그인이 필요한 서비스입니다.</p>
          <p className="mt-1 text-sm text-slate-400">
            로그인 페이지로 이동하시겠습니까?
          </p>
        </>
      ),
      footer: (
        <>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              closeModal();
              router.push("/");
            }}
          >
            취소
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => {
              closeModal();
              router.push("/login");
            }}
          >
            로그인하기
          </Button>
        </>
      ),
    });
  };

  // 인증 체크
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      showLoginModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, isAuthenticated]);

  // 선택된 장바구니 아이템 ID들
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data: rawCartItems, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCartItems,
    enabled: isAuthenticated, // 로그인 상태일 때만 쿼리 실행
  });

  const cartItems = Array.isArray(rawCartItems) ? rawCartItems : [];

  const deleteMutation = useMutation({
    mutationFn: cartApi.deleteCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      closeModal();
    },
  });

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
    openModal({
      title: "상품 삭제",
      content: <p>정말 삭제하시겠습니까?</p>,
      footer: (
        <>
          <Button variant="outline" className="flex-1" onClick={closeModal}>
            취소
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={() => deleteMutation.mutate(id)}
          >
            삭제
          </Button>
        </>
      ),
    });
  };

  const handleOrder = async () => {
    if (selectedIds.length === 0) {
      openModal({
        title: "알림",
        content: <p>주문할 상품을 선택해주세요.</p>,
        footer: (
          <Button variant="primary" fullWidth onClick={closeModal}>
            확인
          </Button>
        ),
      });
      return;
    }

    // 주문 생성 로직
    setIsOrdering(true);
    try {
      const itemsToOrder = cartItems
        .filter((item) => selectedIds.includes(item.cartItemId))
        .map((item) => ({
          productId: item.product.productId,
          quantity: item.quantity,
          optionSnapshot: {
            color: item.product.colors?.[0] || "DEFAULT", // 옵션이 선택되었다면 해당 값 사용해야 함. 현재는 임시 처리
          },
        }));

      const response = await orderApi.createOrder({
        products: itemsToOrder,
      });

      // 장바구니에서 주문한 아이템 제거 (선택적: 주문 완료 후 제거할지, 여기서 제거할지 결정 필요. 보통 주문 성공하면 제거)
      // 여기서는 낙관적으로 제거하지 않고, 주문 완료 시점에 서버에서 처리되거나,
      // 주문 성공 후 장바구니 다시 조회하면 빠져있을 것으로 기대 (백엔드 로직에 따라 다름)

      if (response && response.orderNumber) {
        // 주문 생성 성공 시 상세(배송정보 입력) 페이지로 이동
        router.push(`/orders/update/${response.orderNumber}`);
      } else {
        throw new Error("주문 번호를 받지 못했습니다.");
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      openModal({
        title: "주문 실패",
        content: <p>주문 생성 중 오류가 발생했습니다. 다시 시도해주세요.</p>,
        footer: (
          <Button variant="primary" fullWidth onClick={closeModal}>
            확인
          </Button>
        ),
      });
    } finally {
      setIsOrdering(false);
    }
  };

  if (!mounted) return null;

  if (isLoading && isAuthenticated)
    return <div className="py-20 text-center">장바구니를 불러오는 중...</div>;

  const totalAmount = cartItems
    .filter((item) => selectedIds.includes(item.cartItemId))
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

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
                    <span className="font-bold text-xl text-slate-900">
                      {formatPrice(totalAmount)}원
                    </span>
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
