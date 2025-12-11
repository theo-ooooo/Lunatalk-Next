"use client";

import Image from "next/image";
import { Exhibition } from "@/types/api";
import { getImageUrl } from "@/lib/utils";
import { useState } from "react";

interface ExhibitionBannerProps {
  exhibition: Exhibition;
  index: number;
}

export default function ExhibitionBanner({
  exhibition,
  index,
}: ExhibitionBannerProps) {
  const isEven = index % 2 === 0;

  // 기획전의 첫 번째 상품 이미지를 배너 이미지로 사용
  const firstProduct = exhibition.products?.sort(
    (a, b) => a.sortOrder - b.sortOrder
  )[0]?.product;

  // 상품 이미지 중 썸네일 혹은 첫 번째 이미지 찾기
  const rawImage =
    firstProduct?.images?.find((img) => img.imageType === "PRODUCT_THUMBNAIL")
      ?.imageUrl || firstProduct?.images?.[0]?.imageUrl;

  const [imgSrc, setImgSrc] = useState(getImageUrl(rawImage));

  return (
    <section className="relative w-full py-12 md:py-20 overflow-hidden">
      {/* Background with simple color */}
      <div className={`absolute inset-0 ${isEven ? 'bg-blue-50/50' : 'bg-gray-50/80'} -skew-y-2 transform origin-top-left scale-110`}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* 텍스트 영역 */}
          <div className="flex-1 max-w-2xl pt-4 md:pt-0">
            <span className="inline-block px-3 py-1 bg-white rounded-full text-blue-600 text-xs font-bold mb-4 shadow-sm border border-blue-100">
              SPECIAL EXHIBITION
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-[1.2] text-slate-900 break-keep tracking-tight">
              {exhibition.title}
            </h2>
            <p className="text-lg text-slate-600 whitespace-pre-wrap break-keep leading-relaxed font-medium">
              {exhibition.description}
            </p>
          </div>

          {/* 대표 이미지 영역 (배너 역할) */}
          {firstProduct && (
            <div className="w-full md:w-[420px] aspect-[4/3] relative rounded-[32px] overflow-hidden shadow-2xl shadow-slate-200/50 transform md:rotate-2 hover:rotate-0 transition-all duration-500 bg-white ring-1 ring-black/5">
              <Image
                src={imgSrc}
                alt={exhibition.title}
                fill
                className="object-cover"
                onError={() =>
                  setImgSrc("https://placehold.co/600x600/f3f4f6/9ca3af?text=LUNATALK")
                }
                priority={index === 0}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
