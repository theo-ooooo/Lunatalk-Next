"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Product } from "@/types/api";
import { productApi } from "@/services/api";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface ProductSelectorProps {
  selectedProductId?: number;
  onSelect: (productId: number, productName: string) => void;
}

export function ProductSelector({
  selectedProductId,
  onSelect,
}: ProductSelectorProps) {
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["products", "inquiry", page, searchQuery],
    queryFn: () =>
      productApi.getProducts({
        page,
        size: 12,
        productName: searchQuery || undefined,
      }),
  });

  const products = data?.content || [];

  const getProductImage = (product: Product) => {
    const rawThumbnail =
      product.images?.find((img) => img.imageType === "PRODUCT_THUMBNAIL")
        ?.imagePath || product.images?.[0]?.imageUrl;
    return getImageUrl(rawThumbnail);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          상품 검색
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            placeholder="상품명으로 검색하세요"
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          <p>상품을 찾을 수 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-2">
            {products.map((product) => {
              const isSelected = selectedProductId === product.productId;
              return (
                <button
                  key={product.productId}
                  type="button"
                  onClick={() =>
                    onSelect(
                      product.productId,
                      product.name || product.productName || ""
                    )
                  }
                  className={`relative border-2 rounded-lg overflow-hidden transition-all ${
                    isSelected
                      ? "border-slate-900 ring-2 ring-slate-900 ring-offset-2"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="aspect-square relative bg-gray-50">
                    <Image
                      src={getProductImage(product)}
                      alt={product.name || product.productName || "상품 이미지"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image";
                      }}
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center">
                        <div className="bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-medium">
                          선택됨
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-white">
                    <p className="text-xs text-slate-500 mb-1 line-clamp-1">
                      {product.category?.categoryName}
                    </p>
                    <p className="text-sm font-medium text-slate-900 line-clamp-2 mb-1">
                      {product.name || product.productName}
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {formatPrice(product.price)}원
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                이전
              </button>
              <span className="px-4 py-2 text-slate-700">
                {page + 1} / {data.totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPage((p) => Math.min(data.totalPages - 1, p + 1))
                }
                disabled={page >= data.totalPages - 1}
                className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

