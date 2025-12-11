"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryApi, productApi } from "@/services/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageProductFindResponse } from "@/types/api";

export function useProductList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryIdParam = searchParams.get("categoryId");
  const searchQuery = searchParams.get("search");

  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    categoryIdParam ? Number(categoryIdParam) : null
  );

  useEffect(() => {
    if (categoryIdParam) {
      setSelectedCategory(Number(categoryIdParam));
    } else {
      setSelectedCategory(null);
    }
  }, [categoryIdParam]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getCategories,
  });

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", selectedCategory, searchQuery],
    queryFn: async () => {
      // 카테고리가 선택되었고 검색어가 없을 때는 카테고리별 상품 조회 API 사용
      if (selectedCategory && !searchQuery) {
        const data = await categoryApi.getCategoryProducts(selectedCategory);
        // PageProductFindResponse 형태로 변환하여 반환
        return {
          content: data.products || [],
          totalPages: 1,
          totalElements: data.products?.length || 0,
          number: 0,
          size: data.products?.length || 0,
          first: true,
          last: true,
          numberOfElements: data.products?.length || 0,
          empty: (data.products?.length || 0) === 0,
        } as PageProductFindResponse;
      }

      // 그 외 (전체보기 또는 검색)에는 일반 상품 조회 API 사용
      return productApi.getProducts({
        productName: searchQuery || undefined,
        page: 0,
        size: 20,
      });
    },
  });

  const handleCategoryClick = (id: number | null) => {
    setSelectedCategory(id);
    if (id) {
      // 검색어 유지를 원치 않으면 검색어 제거
      const newSearchParams = new URLSearchParams();
      newSearchParams.set("categoryId", String(id));
      router.push(`/products?${newSearchParams.toString()}`);
    } else {
      router.push("/products");
    }
  };

  return {
    categories,
    productsData,
    isLoading,
    selectedCategory,
    handleCategoryClick,
    searchQuery,
  };
}
