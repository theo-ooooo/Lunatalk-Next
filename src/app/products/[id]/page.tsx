import { productApi } from "@/services/api";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
      {/* Breadcrumb - Static part, dynamic part handled inside Client Component or basic fallback */}
      <div className="container mx-auto px-4 py-6">
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
            {/* Server side doesn't fetch product name to avoid complexity, letting client handle specific data */}
            Product Detail
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <ProductDetailClient productId={Number(id)} />
      </div>
    </div>
  );
}
