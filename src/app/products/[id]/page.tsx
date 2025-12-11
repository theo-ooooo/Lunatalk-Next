import { productApi } from "@/services/api";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import { notFound } from "next/navigation";
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
  let product;
  try {
    product = await productApi.getProduct(Number(id));
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error);
    notFound();
  }

  // 상세 이미지들 필터링
  const contentImages =
    product.images
      ?.filter((img) => img.imageType === "PRODUCT_CONTENT")
      .sort((a, b) => (a.imageOrder || 0) - (b.imageOrder || 0)) || [];

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Breadcrumb */}
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
            {product.category?.categoryName || "PRODUCTS"}
          </Link>
          <ChevronRight className="w-3 h-3 mx-2 text-slate-300" />
          <span className="text-slate-800 line-clamp-1 max-w-[200px]">
            {product.name}
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <ProductDetailClient product={product} />

        {/* 상세 정보 탭/영역 */}
        <div className="mt-24 md:mt-32 max-w-5xl mx-auto">
          <div className="border-b border-gray-100 mb-12 sticky top-16 bg-white/95 backdrop-blur-sm z-10">
            <div className="flex justify-center gap-0 md:gap-8">
              <button className="flex-1 md:flex-none md:min-w-[160px] py-4 text-slate-900 font-bold border-b-2 border-slate-900 transition-colors">
                상품 상세 정보
              </button>
              <button className="flex-1 md:flex-none md:min-w-[160px] py-4 text-slate-400 font-medium hover:text-slate-600 transition-colors border-b-2 border-transparent">
                배송/교환/반품
              </button>
            </div>
          </div>

          <div className="w-full">
            {contentImages.length > 0 ? (
              <div className="space-y-0 flex flex-col items-center">
                {contentImages.map((img) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={img.id}
                    src={getImageUrl(img.imageUrl)}
                    alt="상품 상세 이미지"
                    className="w-full h-auto block max-w-4xl"
                    loading="lazy"
                  />
                ))}
              </div>
            ) : (
              <div className="py-40 text-center flex flex-col items-center justify-center bg-gray-50/50 rounded-[32px] border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4 text-2xl">
                  ?
                </div>
                <p className="text-slate-500 font-medium">
                  상세 정보 이미지가 없습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
