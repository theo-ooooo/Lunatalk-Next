import { useState, useEffect } from "react";
import { Product } from "@/types/api";
import { getImageUrl } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/services/api";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";
import { Button } from "@/components/ui/Button";
import React from "react";

export function useProductDetail(product: Product | undefined) {
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModalStore();

  // 대표 이미지 (썸네일) 초기화
  const getInitialImage = () => {
    if (!product) return "/placeholder.jpg"; // Default placeholder
    const mainImage =
      product.images?.find((i) => i.imageType === "PRODUCT_THUMBNAIL")
        ?.imageUrl || product.images?.[0]?.imageUrl;

    return getImageUrl(mainImage);
  };

  const [imgSrc, setImgSrc] = useState(getInitialImage());

  useEffect(() => {
    setImgSrc(getInitialImage());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const handleQuantityChange = (delta: number) => {
    if (!product) return;
    setQuantity((prev) =>
      Math.max(1, Math.min(product.quantity, prev + delta))
    );
  };

  const showLoginModal = () => {
    openModal({
      title: "로그인 필요",
      content: (
        <div className="text-center">
          <p>로그인이 필요한 서비스입니다.</p>
          <p className="mt-1 text-sm text-slate-400">
            로그인 페이지로 이동하시겠습니까?
          </p>
        </div>
      ),
      footer: (
        <div className="flex gap-2 w-full">
          <Button variant="outline" fullWidth onClick={closeModal}>
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

  const addToCartMutation = useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // Show success modal
      openModal({
        title: "장바구니 담기 완료",
        content: (
          <div className="text-center">
            <p>상품이 장바구니에 담겼습니다.</p>
            <p className="mt-1 text-sm text-slate-400">
              장바구니로 이동하시겠습니까?
            </p>
          </div>
        ),
        footer: (
          <div className="flex gap-2 w-full">
            <Button variant="outline" fullWidth onClick={closeModal}>
              계속 쇼핑
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                closeModal();
                router.push("/cart");
              }}
            >
              장바구니로 이동
            </Button>
          </div>
        ),
      });
    },
    onError: (error) => {
      console.error(error);
      openModal({
        title: "오류",
        content: <p>장바구니 담기에 실패했습니다. 다시 시도해주세요.</p>,
        footer: (
          <Button variant="primary" fullWidth onClick={closeModal}>
            확인
          </Button>
        ),
      });
    },
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      showLoginModal();
      return;
    }
    if (!product) return;

    addToCartMutation.mutate({
      productId: product.productId,
      quantity,
    });
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      showLoginModal();
      return;
    }
    if (!product) return;
    addToCartMutation.mutate(
      {
        productId: product.productId,
        quantity,
      },
      {
        onSuccess: () => router.push("/cart"),
      }
    );
  };

  return {
    quantity,
    imgSrc,
    setImgSrc,
    handleQuantityChange,
    handleAddToCart,
    handleBuyNow,
  };
}
