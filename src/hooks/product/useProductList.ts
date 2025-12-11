import { useQuery } from "@tanstack/react-query";
import { categoryApi, productApi } from "@/services/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useProductList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");
  const searchQuery = searchParams.get("search");

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
    queryFn: () =>
      productApi.getProducts({
        productName: searchQuery || undefined,
        page: 0,
        size: 20,
      }),
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
