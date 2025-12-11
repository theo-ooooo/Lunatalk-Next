import { useQuery } from "@tanstack/react-query";
import { categoryApi, productApi } from "@/services/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageProductFindResponse } from "@/types/api";

export function useProductList(params: { category: string; search: string }) {
  const router = useRouter();
  const categoryId = params.category;
  const searchQuery = params.search;

  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    categoryId ? Number(categoryId) : null
  );

  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(Number(categoryId));
    } else {
      setSelectedCategory(null);
    }
  }, [categoryId]);

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
      router.push(`/products?category=${id}`);
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
