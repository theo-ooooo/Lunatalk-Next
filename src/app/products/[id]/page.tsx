import { productApi } from "@/services/api";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import { notFound } from "next/navigation";
import { getImageUrl } from "@/lib/utils";

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
          ? [getImageUrl(product.images)]
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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <ProductDetailClient product={product} />

        {/* 상세 정보 탭/영역 */}
        <div className="mt-24 md:mt-32">
          <div className="border-b border-slate-200 mb-12 sticky top-16 bg-white z-10">
            <div className="flex justify-center gap-8">
              <button className="px-8 py-4 text-blue-600 font-bold border-b-2 border-blue-600">
                상품 상세 정보
              </button>
              <button className="px-8 py-4 text-slate-500 font-medium hover:text-slate-700">
                배송/교환/반품
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {contentImages.length > 0 ? (
              <div className="space-y-0">
                {contentImages.map((img) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={img.id}
                    src={getImageUrl(img.imageUrl)}
                    alt="상품 상세 이미지"
                    className="w-full h-auto block"
                  />
                ))}
              </div>
            ) : (
              <div className="py-32 text-center text-slate-400 bg-slate-50 rounded-2xl">
                <p>등록된 상세 정보가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
