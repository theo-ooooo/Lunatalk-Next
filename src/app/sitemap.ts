import { MetadataRoute } from "next";
import { productApi, categoryApi } from "@/services/api";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // 1시간마다 재생성

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Production 환경에서만 SEO 처리
  if (process.env.NODE_ENV !== "production") {
    return [];
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://lunatalk.co.kr";

  // 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/wishlist`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  // 동적 페이지: 상품 목록
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const productsData = await productApi.getProducts({
      page: 0,
      size: 1000, // 최대한 많은 상품 가져오기
    });

    if (productsData?.content) {
      productPages = productsData.content.map((product) => ({
        url: `${baseUrl}/products/${product.productId}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error("Failed to fetch products for sitemap:", error);
  }

  return [...staticPages, ...productPages];
}

