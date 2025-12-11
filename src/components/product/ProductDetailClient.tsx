"use client";

import { Product } from "@/types/api";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { useState } from "react";
import { Minus, Plus, ShoppingCart, Heart, Share2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/services/api";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

interface Props {
  product: Product;
}

export default function ProductDetailClient({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  // 대표 이미지 (썸네일)
  const mainImage =
    product.images?.find((i) => i.imageType === "PRODUCT_THUMBNAIL")
      ?.imageUrl || product.images?.[0]?.imageUrl;

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
    <div className="flex flex-col lg:flex-row gap-12">
      {/* Product Image Area */}
      <div className="w-full lg:w-1/2">
        <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden relative border border-slate-100 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getImageUrl(mainImage)}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
        {/* 추가 이미지 썸네일들이 있다면 여기에 배치 (현재는 생략) */}
      </div>

      {/* Product Info Area */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="sticky top-24">
          <div className="mb-6 border-b border-slate-100 pb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1 rounded-full">
                {product.category?.categoryName || "카테고리"}
              </span>
              <div className="flex gap-2 text-slate-400">
                <button className="hover:text-red-500 transition-colors">
                  <Heart className="w-6 h-6" />
                </button>
                <button className="hover:text-blue-600 transition-colors">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {formatPrice(product.price)}
              </span>
              <span className="text-xl font-medium text-slate-500 mb-1">
                원
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-slate-700">수량 선택</span>
                <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-3 hover:bg-slate-50 text-slate-600 disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-3 hover:bg-slate-50 text-slate-600 disabled:opacity-50"
                    disabled={quantity >= product.quantity}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">구매 가능 수량</span>
                <span className="text-slate-900 font-medium">
                  {product.quantity}개
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-slate-100">
              <span className="font-bold text-lg text-slate-700">
                총 상품 금액
              </span>
              <span className="font-bold text-3xl text-blue-600">
                {formatPrice(product.price * quantity)}
                <span className="text-xl text-slate-500 font-medium ml-1">
                  원
                </span>
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                className="flex-1 border-2 border-slate-200 text-slate-700 font-bold py-4 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                장바구니
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.quantity === 0}
                className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                바로 구매하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
