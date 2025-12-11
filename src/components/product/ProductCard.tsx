"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/api";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { useState, useEffect } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // 이미지 URL 초기화 로직
  const getInitialImage = () => {
    // console.log("product", product); // 디버깅 로그 제거 또는 주석 처리
    const rawThumbnail =
      product.images?.find((img) => img.imageType === "PRODUCT_THUMBNAIL")
        ?.imagePath || product.images?.[0]?.imageUrl;

    // 디버깅을 위해 콘솔 출력
    if (process.env.NODE_ENV === "development") {
      // console.log(`[ProductCard] ${product.name} image:`, rawThumbnail);
    }

    return getImageUrl(rawThumbnail);
  };

  const [imgSrc, setImgSrc] = useState(getInitialImage());
  const [isHovered, setIsHovered] = useState(false);

  // product prop이 변경될 때 이미지 URL 업데이트 (필요 시)
  useEffect(() => {
    setImgSrc(getInitialImage());
  }, [product]);

  return (
    <Link
      href={`/products/${product.productId}`}
      className="group block relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square relative overflow-hidden rounded-[16px] bg-gray-50 mb-3 transition-all duration-300 group-hover:shadow-md">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-500 ${
            isHovered ? "scale-105" : "scale-100"
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          onError={() => {
            // console.error(`Failed to load image for product: ${product.name}`);
            setImgSrc(
              "https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image"
            );
          }}
        />
        {product.quantity === 0 && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-white font-bold px-3 py-1.5 border border-white/30 rounded-full text-xs">
              SOLD OUT
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1 px-1">
        <p className="text-[11px] font-medium text-slate-400">
          {product.category?.categoryName}
        </p>
        <h3 className="font-medium text-slate-800 text-[14px] leading-snug line-clamp-2 min-h-[2.2rem] group-hover:text-slate-900 transition-colors">
          {product.name || product.productName}
        </h3>
        <div className="pt-0.5 flex items-baseline gap-0.5">
          <span className="font-bold text-lg text-slate-900">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs font-medium text-slate-800">원</span>
        </div>
      </div>
    </Link>
  );
}
