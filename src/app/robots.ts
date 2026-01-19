import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Production 환경에서만 SEO 처리
  if (process.env.NODE_ENV !== "production") {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: "/",
        },
      ],
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://lunatalk.co.kr";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/cart",
          "/wishlist",
          "/mypage",
          "/orders",
          "/inquiries",
          "/login",
          "/register",
          "/orders/payment/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
