import { Suspense } from "react";
import ProductListContent from "@/components/products/ProductListContent";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "상품 목록 - LUNATALK",
  description: "루나톡의 다양한 상품을 만나보세요.",
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
