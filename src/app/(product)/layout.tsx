import DesktopHeader from "@/components/layout/DesktopHeader";
import Footer from "@/components/layout/Footer";
import ProductDetailMobileHeader from "@/components/product/ProductDetailMobileHeader";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DesktopHeader />
      <ProductDetailMobileHeader />
      <main className="flex-1 md:pb-0">{children}</main>
      <Footer />
    </>
  );
}


