import DesktopHeader from "@/components/layout/DesktopHeader";
import MobileSubHeader from "@/components/layout/MobileSubHeader";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DesktopHeader />
      <MobileSubHeader />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
