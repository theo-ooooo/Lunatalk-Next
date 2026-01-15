"use client";

import { formatPrice, getImageUrl } from "@/lib/utils";
import { Minus, Plus, ShoppingCart, Heart, Share2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useProductDetail } from "@/hooks/product/useProductDetail";
import { useProduct } from "@/hooks/product/useProduct";
import { useProductLike } from "@/hooks/product/useProductLike";

interface Props {
  productId: number;
}

export default function ProductDetailClient({ productId }: Props) {
  const { product } = useProduct(productId);
  const {
    quantity,
    imgSrc,
    setImgSrc,
    handleQuantityChange,
    handleAddToCart,
    handleBuyNow,
  } = useProductDetail(product);
  const { isLiked, likeCount, isToggling, handleToggleLike } = useProductLike(
    productId,
    { isLiked: product?.isLiked, likeCount: product?.likeCount }
  );

  // 상세 이미지들 필터링
  const contentImages =
    product.images
      ?.filter((img) => img.imageType === "PRODUCT_CONTENT")
      .sort((a, b) => (a.imageOrder || 0) - (b.imageOrder || 0)) || [];

  return (
    <>
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
                    onClick={handleToggleLike}
                    disabled={isToggling}
                    className={`p-1.5 md:p-2 hover:bg-gray-50 rounded-full hover:text-slate-900 transition-all ${
                      isLiked
                        ? "text-red-500 fill-red-500 hover:text-red-600 hover:fill-red-600"
                        : ""
                    } ${isToggling ? "opacity-50 cursor-not-allowed" : ""}`}
                    aria-label={isLiked ? "찜하기 취소" : "찜하기"}
                  >
                    <Heart
                      className={`w-5 h-5 md:w-6 md:h-6 stroke-[1.5] ${
                        isLiked ? "fill-current" : ""
                      }`}
                    />
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
                <Button
                  onClick={handleAddToCart}
                  disabled={product.quantity === 0}
                  variant="outline"
                  size="lg"
                  className="flex-1 text-lg py-6 h-auto"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  장바구니
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={product.quantity === 0}
                  variant="primary"
                  size="lg"
                  className="flex-1 text-lg py-6 h-auto"
                >
                  바로 구매하기
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Bottom Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
              variant="outline"
              className="flex-1 h-14 text-base"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              장바구니
            </Button>
            <Button
              onClick={handleBuyNow}
              disabled={product.quantity === 0}
              variant="primary"
              className="flex-[2] h-14 text-base shadow-slate-100"
            >
              구매하기
            </Button>
          </div>
        </div>
      </div>

      {/* 상세 정보 탭/영역 (moved from page.tsx to here since product is fetched here) */}
      <div className="mt-24 md:mt-32 max-w-5xl mx-auto">
        <div className="border-b border-gray-100 mb-12 sticky top-16 bg-white/95 backdrop-blur-sm z-10">
          <div className="flex justify-center gap-0 md:gap-8">
            <button className="flex-1 md:flex-none md:min-w-[160px] py-4 text-slate-900 font-bold border-b-2 border-slate-900 transition-colors">
              상품 상세 정보
            </button>
            <button className="flex-1 md:flex-none md:min-w-[160px] py-4 text-slate-400 font-medium hover:text-slate-600 transition-colors border-b-2 border-transparent">
              배송/교환/반품
            </button>
          </div>
        </div>

        <div className="w-full">
          {contentImages.length > 0 ? (
            <div className="space-y-0 flex flex-col items-center">
              {contentImages.map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={img.imageKey}
                  src={getImageUrl(img.imageUrl)}
                  alt="상품 상세 이미지"
                  className="w-full h-auto block max-w-4xl"
                  loading="lazy"
                />
              ))}
            </div>
          ) : (
            <div className="py-40 text-center flex flex-col items-center justify-center bg-gray-50/50 rounded-[32px] border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4 text-2xl">
                ?
              </div>
              <p className="text-slate-500 font-medium">
                상세 정보 이미지가 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
