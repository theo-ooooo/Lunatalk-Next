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

  // Production 환경이 아니면 기본 메타데이터만 반환
  if (process.env.NODE_ENV !== "production") {
    return {
      title: "상품 상세",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  try {
    const product = await productApi.getProduct(Number(id));
    const imageUrl = product.images?.[0]?.imageUrl
      ? getImageUrl(product.images[0].imageUrl)
      : undefined;
    const price = product.price ? `${product.price.toLocaleString()}원` : "";
    const category = product.category?.categoryName || "";

    return {
      title: `${product.name} - LUNATALK`,
      description: `${product.name}${price ? ` | ${price}` : ""}${
        category ? ` | ${category}` : ""
      }. 루나톡에서 만나보세요.`,
      keywords: [product.name, category, "루나톡", "LUNATALK"].filter(Boolean),
      openGraph: {
        title: `${product.name} - LUNATALK`,
        description: `${product.name}${price ? ` | ${price}` : ""}${
          category ? ` | ${category}` : ""
        }`,
        type: "product",
        images: imageUrl ? [imageUrl] : [],
        url: `/products/${id}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} - LUNATALK`,
        description: `${product.name}${price ? ` | ${price}` : ""}`,
        images: imageUrl ? [imageUrl] : [],
      },
      alternates: {
        canonical: `/products/${id}`,
      },
    };
  } catch (error) {
    return {
      title: "상품을 찾을 수 없습니다. - LUNATALK",
      description: "요청하신 상품을 찾을 수 없습니다.",
      robots: {
        index: false,
        follow: false,
      },
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
