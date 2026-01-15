import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import GlobalModal from "@/components/providers/GlobalModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LUNATALK - 일상의 즐거움",
  description: "루나톡 쇼핑몰입니다.",
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
