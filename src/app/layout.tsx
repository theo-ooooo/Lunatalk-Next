import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import GlobalModal from "@/components/providers/GlobalModal";

const inter = Inter({ subsets: ["latin"] });

// Production 환경에서만 SEO 메타데이터 적용
const isProduction = process.env.NODE_ENV === "production";

export const metadata: Metadata = isProduction
  ? {
      metadataBase: new URL(
        process.env.NEXT_PUBLIC_BASE_URL || "https://lunatalk.co.kr"
      ),
      title: {
        default: "LUNATALK - 일상의 즐거움",
        template: "%s | LUNATALK",
      },
      description:
        "루나톡에서 다양한 상품을 만나보세요. 일상의 즐거움을 선사하는 쇼핑몰입니다.",
      keywords: [
        "루나톡",
        "LUNATALK",
        "쇼핑몰",
        "온라인 쇼핑",
        "상품",
        "기획전",
      ],
      authors: [{ name: "LUNATALK" }],
      creator: "LUNATALK",
      publisher: "LUNATALK",
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      openGraph: {
        type: "website",
        locale: "ko_KR",
        url: "/",
        siteName: "LUNATALK",
        title: "LUNATALK - 일상의 즐거움",
        description:
          "루나톡에서 다양한 상품을 만나보세요. 일상의 즐거움을 선사하는 쇼핑몰입니다.",
        images: [
          {
            url: "/og-image.jpg",
            width: 1200,
            height: 630,
            alt: "LUNATALK",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "LUNATALK - 일상의 즐거움",
        description:
          "루나톡에서 다양한 상품을 만나보세요. 일상의 즐거움을 선사하는 쇼핑몰입니다.",
        images: ["/og-image.jpg"],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      verification: {
        // Google Search Console, Naver Search Advisor 등 필요시 추가
        // google: "your-google-verification-code",
        // naver: "your-naver-verification-code",
      },
    }
  : {
      title: "LUNATALK - 일상의 즐거움",
      description: "루나톡 쇼핑몰입니다.",
      robots: {
        index: false,
        follow: false,
      },
    };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${inter.className} min-h-screen flex flex-col text-slate-900`}
      >
        <QueryProvider>
          {children}
          <GlobalModal />
        </QueryProvider>
      </body>
    </html>
  );
}
