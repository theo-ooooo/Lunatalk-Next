"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Product } from "@/types/api";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { useProductLike } from "@/hooks/product/useProductLike";

interface ProductRowProps {
  product: Product;
  showLike?: boolean;
}

export default function ProductRow({ product, showLike = true }: ProductRowProps) {
  const [imgSrc, setImgSrc] = useState(getImageUrl(product.images?.[0]?.imageUrl));

  useEffect(() => {
    setImgSrc(getImageUrl(product.images?.[0]?.imageUrl));
  }, [product]);

  const { isLiked, isToggling, handleToggleLike } = useProductLike(
    product.productId,
    { isLiked: product.isLiked, likeCount: product.likeCount }
  );

  return (
    <div className="flex gap-4 py-4 border-b border-slate-200">
      <Link
        href={`/products/${product.productId}`}
        className="w-20 h-20 rounded-md border border-slate-200 bg-white overflow-hidden shrink-0"
        aria-label={product.name}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={product.name || product.productName || "상품 이미지"}
          className="w-full h-full object-cover"
          onError={() =>
            setImgSrc("https://placehold.co/200x200/f3f4f6/9ca3af?text=No+Image")
          }
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <Link
              href={`/products/${product.productId}`}
              className="block text-sm md:text-[15px] font-semibold text-slate-900 line-clamp-2 hover:underline"
            >
              {product.name || product.productName}
            </Link>
            <div className="mt-1 text-xs text-slate-500 flex items-center gap-2">
              <span className="truncate">{product.category?.categoryName}</span>
              <span className="w-px h-3 bg-slate-200" aria-hidden />
              <span>좋아요 {product.likeCount ?? 0}</span>
              {"reviewCount" in product && (
                <>
                  <span className="w-px h-3 bg-slate-200" aria-hidden />
                  <span>리뷰 {(product as any).reviewCount ?? 0}</span>
                </>
              )}
            </div>
          </div>

          {showLike && (
            <button
              onClick={(e) => {
                e.preventDefault();
                handleToggleLike();
              }}
              disabled={isToggling}
              className={`h-9 w-9 flex items-center justify-center rounded-full border border-slate-200 hover:border-slate-400 transition-colors ${
                isLiked ? "text-red-500" : "text-slate-500"
              } ${isToggling ? "opacity-50 cursor-not-allowed" : ""}`}
              aria-label={isLiked ? "찜하기 취소" : "찜하기"}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </button>
          )}
        </div>

        <div className="mt-2 flex items-end justify-between">
          <div className="text-[15px] md:text-[16px] font-extrabold text-slate-900">
            {formatPrice(product.price)}원
          </div>
          {product.quantity === 0 && (
            <span className="text-xs font-semibold text-slate-500">
              품절
            </span>
          )}
        </div>
      </div>
    </div>
  );
}


