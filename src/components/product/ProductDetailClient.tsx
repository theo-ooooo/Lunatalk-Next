"use client";

import { Product } from "@/types/api";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Minus, Plus, ShoppingCart, Heart, Share2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/services/api";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";

interface Props {
  product: Product;
}

export default function ProductDetailClient({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  // 대표 이미지 (썸네일) 초기화
  const getInitialImage = () => {
    const mainImage =
      product.images?.find((i) => i.imageType === "PRODUCT_THUMBNAIL")
        ?.imageUrl || product.images?.[0]?.imageUrl;

    if (process.env.NODE_ENV === "development") {
      console.log(`[ProductDetail] Main Image:`, mainImage);
    }
    return getImageUrl(mainImage);
  };

  const [imgSrc, setImgSrc] = useState(getInitialImage());

  useEffect(() => {
    setImgSrc(getInitialImage());
  }, [product]);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) =>
      Math.max(1, Math.min(product.quantity, prev + delta))
    );
  };

  const addToCartMutation = useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      if (
        confirm("상품이 장바구니에 담겼습니다. 장바구니로 이동하시겠습니까?")
      ) {
        router.push("/cart");
      }
    },
    onError: (error) => {
      alert("장바구니 담기에 실패했습니다. 다시 시도해주세요.");
      console.error(error);
    },
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      if (
        confirm(
          "로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?"
        )
      ) {
        router.push("/login");
      }
      return;
    }

    addToCartMutation.mutate({
      productId: product.productId,
      quantity,
    });
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      if (
        confirm(
          "로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?"
        )
      ) {
        router.push("/login");
      }
      return;
    }
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

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-20">
      {/* Product Image Area */}
      <div className="w-full lg:w-1/2">
        <div className="aspect-square bg-gray-50 rounded-[20px] md:rounded-[32px] overflow-hidden relative shadow-sm border border-gray-100">
          <Image
            src={imgSrc}
            alt={product.name || "상품 이미지"}
            fill
            className="object-cover"
            priority
            onError={() => {
              console.error(`[ProductDetail] Failed to load image`);
              setImgSrc(
                "https://placehold.co/800x800/f3f4f6/9ca3af?text=No+Image"
              );
            }}
          />
        </div>
      </div>

      {/* Product Info Area */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="lg:sticky lg:top-24">
          <div className="mb-6 border-b border-gray-100 pb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-900 font-bold text-xs md:text-sm bg-slate-100 px-2.5 py-1 rounded-full">
                {product.category?.categoryName || "Category"}
              </span>
              <div className="flex gap-2 md:gap-3 text-slate-400">
                <button 
                  className="p-1.5 md:p-2 hover:bg-gray-50 rounded-full hover:text-red-500 transition-all"
                  aria-label="찜하기"
                >
                  <Heart className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5]" />
                </button>
                <button 
                  className="p-1.5 md:p-2 hover:bg-gray-50 rounded-full hover:text-slate-900 transition-all"
                  aria-label="공유하기"
                >
                  <Share2 className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5]" />
                </button>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-[40px] font-bold text-slate-900 mb-3 md:mb-6 leading-tight tracking-tight break-keep">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-1.5 md:gap-2">
              <span className="text-2xl md:text-[32px] font-bold text-slate-900">
                {formatPrice(product.price)}
              </span>
              <span className="text-base md:text-xl font-medium text-slate-500">
                원
              </span>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8 pb-24 lg:pb-0">
            {/* 수량 선택 */}
            <div className="bg-gray-50/50 p-4 md:p-6 rounded-[20px] md:rounded-[24px] border border-gray-100">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <span className="text-sm md:text-base font-semibold text-slate-700">
                  수량
                </span>
                <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-3 hover:bg-gray-50 text-slate-500 disabled:opacity-30 transition-colors"
                    disabled={quantity <= 1}
                    aria-label="수량 줄이기"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 md:w-12 text-center font-bold text-slate-900 text-base md:text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-3 hover:bg-gray-50 text-slate-500 disabled:opacity-30 transition-colors"
                    disabled={quantity >= product.quantity}
                    aria-label="수량 늘리기"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs md:text-sm">
                <span className="text-slate-500">구매 가능 수량</span>
                <span className="text-slate-900 font-bold">
                  {product.quantity}개
                </span>
              </div>
            </div>

            {/* 총 금액 */}
            <div className="flex items-center justify-between py-2">
              <span className="font-bold text-base md:text-lg text-slate-900">
                총 상품 금액
              </span>
              <span className="font-bold text-2xl md:text-3xl text-slate-900">
                {formatPrice(product.price * quantity)}
                <span className="text-base md:text-xl text-slate-500 font-medium ml-1">
                  원
                </span>
              </span>
            </div>

            {/* Desktop Buttons (Hidden on mobile) */}
            <div className="hidden lg:flex gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                className="flex-1 border border-gray-200 bg-white text-slate-800 font-bold py-4 rounded-[18px] hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                장바구니
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.quantity === 0}
                className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-[18px] hover:bg-slate-800 shadow-slate-200 hover:shadow-lg hover:shadow-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                바로 구매하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={product.quantity === 0}
            className="flex-1 border border-gray-200 bg-white text-slate-800 font-bold py-3.5 rounded-[16px] active:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-base"
          >
            <ShoppingCart className="w-5 h-5" />
            장바구니
          </button>
          <button
            onClick={handleBuyNow}
            disabled={product.quantity === 0}
            className="flex-[2] bg-slate-900 text-white font-bold py-3.5 rounded-[16px] active:bg-slate-800 transition-all disabled:opacity-50 text-base shadow-slate-100"
          >
            구매하기
          </button>
        </div>
      </div>
    </div>
  );
}
