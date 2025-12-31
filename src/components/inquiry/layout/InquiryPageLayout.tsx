"use client";

import { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface InquiryPageLayoutProps {
  children: ReactNode;
  backHref: string;
  backLabel?: string;
  title?: string;
}

export function InquiryPageLayout({
  children,
  backHref,
  backLabel = "목록으로",
  title,
}: InquiryPageLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href={backHref}
          className="inline-flex items-center justify-center rounded-xl font-bold h-11 px-4 text-base border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 active:scale-[0.98] mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {backLabel}
        </Link>

        {title && (
          <div className="bg-white rounded-xl p-6 border border-slate-200 mb-6">
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          </div>
        )}

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
}
