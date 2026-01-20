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

  const thumbnailImages =
    product.images
      ?.filter((img) => img.imageType === "PRODUCT_THUMBNAIL")
      .sort((a, b) => (a.imageOrder || 0) - (b.imageOrder || 0)) || [];

  // 상세 이미지들 필터링
  const contentImages =
    product.images
      ?.filter((img) => img.imageType === "PRODUCT_CONTENT")
      .sort((a, b) => (a.imageOrder || 0) - (b.imageOrder || 0)) || [];

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
        {/* Image */}
        <section className="w-full lg:w-1/2">
          <div className="-mx-4 md:mx-0">
            <div className="relative aspect-square bg-slate-50 overflow-hidden md:rounded-2xl md:border md:border-slate-200">
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

            {/* Thumbnails */}
            {thumbnailImages.length > 1 && (
              <div className="mt-3 px-4 md:px-0">
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {thumbnailImages.map((img) => {
                    const src = getImageUrl(img.imageUrl || img.imagePath);
                    const active = src === imgSrc;
                    return (
                      <button
                        key={img.imageKey}
                        type="button"
                        onClick={() => setImgSrc(src)}
                        className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border ${
                          active
                            ? "border-slate-900"
                            : "border-slate-200 hover:border-slate-400"
                        }`}
                        aria-label="썸네일 보기"
                      >
                        <Image
                          src={src}
                          alt="썸네일"
                          fill
                          className="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Summary / Purchase */}
        <section className="w-full lg:w-1/2">
          <div className="lg:sticky lg:top-24">
            <div className="pb-4 border-b border-slate-100">
              <div className="text-xs font-semibold text-slate-500">
                {product.category?.categoryName || "Category"}
              </div>
              <h1 className="mt-1 text-[18px] md:text-[26px] font-extrabold text-slate-900 leading-snug tracking-tight break-keep">
                {product.name}
              </h1>

              {product.colors && product.colors.length > 0 && (
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {product.colors.map((color, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-white text-slate-600 rounded border border-slate-200"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-3 flex items-end justify-between gap-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-[22px] md:text-[30px] font-extrabold text-slate-900">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">
                    원
                  </span>
                </div>

                {/* Desktop only actions */}
                <div className="hidden lg:flex items-center gap-2 text-slate-400">
                  <button
                    onClick={handleToggleLike}
                    disabled={isToggling}
                    className={`p-2 rounded-full hover:bg-slate-50 hover:text-slate-900 transition-all ${
                      isLiked ? "text-red-500 fill-red-500" : ""
                    } ${isToggling ? "opacity-50 cursor-not-allowed" : ""}`}
                    aria-label={isLiked ? "찜하기 취소" : "찜하기"}
                  >
                    <Heart
                      className={`w-6 h-6 stroke-[1.5] ${
                        isLiked ? "fill-current" : ""
                      }`}
                    />
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-slate-50 hover:text-slate-900 transition-all"
                    aria-label="공유하기"
                  >
                    <Share2 className="w-6 h-6 stroke-[1.5]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="pt-3 space-y-2 pb-0">
              {/* Quantity */}
              <div className="bg-white rounded-lg border border-slate-200 px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    수량
                  </span>
                  <div className="flex items-center border border-slate-200 rounded-md overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="h-8 w-8 inline-flex items-center justify-center hover:bg-slate-50 text-slate-600 disabled:opacity-30"
                      disabled={quantity <= 1}
                      aria-label="수량 줄이기"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center font-extrabold text-slate-900 text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="h-8 w-8 inline-flex items-center justify-center hover:bg-slate-50 text-slate-600 disabled:opacity-30"
                      disabled={quantity >= product.quantity}
                      aria-label="수량 늘리기"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700">
                  총 상품 금액
                </span>
                <span className="text-[16px] font-extrabold text-slate-900">
                  {formatPrice(product.price * quantity)}원
                </span>
              </div>

              {/* Desktop CTA */}
              <div className="hidden lg:flex gap-3 pt-2">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.quantity === 0}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  장바구니
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={product.quantity === 0}
                  variant="primary"
                  size="lg"
                  className="flex-1"
                >
                  바로 구매하기
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Sticky Purchase Bar (무신사 스타일: 찜 + 구매하기) */}
        <div className="lg:hidden fixed left-0 right-0 bottom-[env(safe-area-inset-bottom)] z-50">
          {/* 배송/혜택 스트립 */}
          <div className="px-4 py-2 bg-[#0B2C7A] text-white text-[11px] font-semibold">
            무료배송 · 빠른배송 상품은 배송/가격 정책이 다를 수 있어요.
          </div>

          <div className="bg-white border-t border-slate-200 px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleToggleLike}
                disabled={isToggling}
                className="flex items-center gap-2 min-w-[72px]"
                aria-label={isLiked ? "찜하기 취소" : "찜하기"}
              >
                <Heart
                  className={`w-6 h-6 stroke-[1.75] ${
                    isLiked ? "text-red-500 fill-red-500" : "text-slate-900"
                  }`}
                />
                <span className="text-sm font-extrabold text-slate-900">
                  {likeCount ?? 0}
                </span>
              </button>

              <Button
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                variant="outline"
                className="h-12 px-4 rounded-lg border-slate-300"
              >
                <ShoppingCart className="w-5 h-5" />
              </Button>

              <Button
                onClick={handleBuyNow}
                disabled={product.quantity === 0}
                variant="primary"
                className="flex-1 h-12 text-[14px] rounded-lg"
              >
                구매하기
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 상세 정보 탭/영역 (moved from page.tsx to here since product is fetched here) */}
      <div className="mt-8 md:mt-32 max-w-5xl mx-auto">
        <div className="border-b border-slate-100 mb-8 sticky top-12 md:top-16 bg-white/95 backdrop-blur-sm z-10">
          <div className="flex justify-center gap-0 md:gap-8">
            <button className="flex-1 md:flex-none md:min-w-[160px] py-3 text-[13px] md:text-base text-slate-900 font-bold border-b-2 border-slate-900 transition-colors">
              상품 상세 정보
            </button>
            <button className="flex-1 md:flex-none md:min-w-[160px] py-3 text-[13px] md:text-base text-slate-400 font-medium hover:text-slate-600 transition-colors border-b-2 border-transparent">
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
