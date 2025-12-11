import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { cartApi, orderApi } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";
import { Button } from "@/components/ui/Button";
import React from "react";

export function useCart() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { openModal, closeModal } = useModalStore();

  const [mounted, setMounted] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showLoginModal = () => {
    openModal({
      title: "로그인 필요",
      content: (
        <div className="text-center">
          <p>장바구니는 로그인이 필요한 서비스입니다.</p>
          <p className="mt-1 text-sm text-slate-400">
            로그인 페이지로 이동하시겠습니까?
          </p>
        </div>
      ),
      footer: (
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            fullWidth
            onClick={() => {
              closeModal();
              router.push("/");
            }}
          >
            취소
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              closeModal();
              router.push("/login");
            }}
          >
            로그인하기
          </Button>
        </div>
      ),
    });
  };

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      showLoginModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, isAuthenticated]);

  const { data: rawCartItems, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCartItems,
    enabled: isAuthenticated,
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
        <div className="flex gap-2 w-full">
          <Button variant="outline" fullWidth onClick={closeModal}>
            취소
          </Button>
          <Button
            variant="destructive"
            fullWidth
            onClick={() => deleteMutation.mutate(id)}
          >
            삭제
          </Button>
        </div>
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

    setIsOrdering(true);
    try {
      const itemsToOrder = cartItems
        .filter((item) => selectedIds.includes(item.cartItemId))
        .map((item) => ({
          productId: item.product.productId,
          quantity: item.quantity,
          optionSnapshot: {
            color: item.product.colors?.[0] || "DEFAULT",
          },
        }));

      const response = await orderApi.createOrder({
        products: itemsToOrder,
      });

      if (response && response.orderNumber) {
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

  const totalAmount = cartItems
    .filter((item) => selectedIds.includes(item.cartItemId))
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return {
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
  };
}

