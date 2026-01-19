import { Suspense } from "react";
import ProductListContent from "@/components/products/ProductListContent";
import { Loader2 } from "lucide-react";
import type { Metadata } from "next";

// Production 환경에서만 SEO 메타데이터 적용
const isProduction = process.env.NODE_ENV === "production";

export const metadata: Metadata = isProduction
  ? {
      title: "상품 목록",
      description: "루나톡의 다양한 상품을 만나보세요.",
    }
  : {
      title: "상품 목록",
      description: "루나톡의 다양한 상품을 만나보세요.",
      robots: {
        index: false,
        follow: false,
      },
    };

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      }
    >
      <ProductListContent />
    </Suspense>
  );
}
