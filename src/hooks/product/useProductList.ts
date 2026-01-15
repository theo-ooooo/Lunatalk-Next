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
  const pageSize = 20;

  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    categoryIdParam ? Number(categoryIdParam) : null
  );
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (categoryIdParam) {
      setSelectedCategory(Number(categoryIdParam));
    } else {
      setSelectedCategory(null);
    }
  }, [categoryIdParam]);

  // 카테고리/검색 조건이 바뀌면 첫 페이지로
  useEffect(() => {
    setPage(0);
  }, [selectedCategory, searchQuery]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getCategories,
  });

  // 카테고리 선택 + 검색어 없음: 백엔드가 "카테고리 상품"을 페이지로 안 주므로(리스트) 프론트에서 페이지네이션 처리
  const categoryProductsQuery = useQuery({
    queryKey: ["categoryProducts", selectedCategory],
    queryFn: () => categoryApi.getCategoryProducts(selectedCategory as number),
    enabled: !!selectedCategory && !searchQuery,
  });

  // 전체보기/검색: /products pageable 사용
  const productsQuery = useQuery({
    queryKey: ["products", searchQuery, page],
    queryFn: () =>
      productApi.getProducts({
        productName: searchQuery || undefined,
        page,
        size: pageSize,
      }),
    enabled: !selectedCategory || !!searchQuery,
  });

  const productsData: PageProductFindResponse | undefined = (() => {
    if (selectedCategory && !searchQuery) {
      const all = categoryProductsQuery.data?.products || [];
      const totalElements = all.length;
      const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
      const safePage = Math.min(Math.max(0, page), totalPages - 1);
      const start = safePage * pageSize;
      const end = start + pageSize;
      const content = all.slice(start, end);
      return {
        content,
        totalPages,
        totalElements,
        number: safePage,
        size: pageSize,
        first: safePage === 0,
        last: safePage === totalPages - 1,
        numberOfElements: content.length,
        empty: content.length === 0,
      } as PageProductFindResponse;
    }

    return productsQuery.data;
  })();

  const isLoading =
    selectedCategory && !searchQuery
      ? categoryProductsQuery.isLoading
      : productsQuery.isLoading;

  const handleCategoryClick = (id: number | null) => {
    setSelectedCategory(id);
    setPage(0);
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
    page,
    setPage,
    pageSize,
  };
}
