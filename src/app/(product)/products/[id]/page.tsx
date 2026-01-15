import { Suspense } from "react";
import { productApi } from "@/services/api";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Loading } from "@/components/common/Loading";
import { QueryErrorBoundary } from "@/components/common/QueryErrorBoundary";
import { Button } from "@/components/ui/Button";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  try {
    const product = await productApi.getProduct(Number(id));
    return {
      title: `${product.name} - LUNATALK`,
      description: `루나톡에서 ${product.name}을 만나보세요.`,
      openGraph: {
        images: product.images?.[0]?.imageUrl
          ? [getImageUrl(product.images?.[0]?.imageUrl)]
          : [],
      },
    };
  } catch (error) {
    return {
      title: "상품을 찾을 수 없습니다.",
    };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Breadcrumb: desktop only */}
      <div className="hidden md:block container mx-auto px-4 py-6">
        <div className="flex items-center text-xs md:text-sm text-slate-400 font-medium">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            HOME
          </Link>
          <ChevronRight className="w-3 h-3 mx-2 text-slate-300" />
          <Link
            href="/products"
            className="hover:text-slate-900 transition-colors"
          >
            PRODUCTS
          </Link>
          <ChevronRight className="w-3 h-3 mx-2 text-slate-300" />
          <span className="text-slate-800 line-clamp-1 max-w-[200px]">
            Product Detail
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-12">
        <QueryErrorBoundary
          fallback={
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
              <p className="text-slate-500 font-medium">
                상품을 찾을 수 없습니다.
              </p>
              <Link href="/products">
                <Button variant="outline">상품 목록으로 돌아가기</Button>
              </Link>
            </div>
          }
        >
          <Suspense fallback={<Loading message="상품 정보를 불러오는 중..." />}>
            <ProductDetailClient productId={Number(id)} />
          </Suspense>
        </QueryErrorBoundary>
      </div>
    </div>
  );
}


