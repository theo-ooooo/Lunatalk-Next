"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { InquiryResponse } from "@/types/api";

interface InquiryEditGuardProps {
  inquiry: InquiryResponse;
  children: ReactNode;
}

export function InquiryEditGuard({ inquiry, children }: InquiryEditGuardProps) {
  if (inquiry.status !== "PENDING") {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
          <div className="bg-white rounded-xl p-6 border border-slate-200 text-center">
            <p className="text-slate-600 mb-4">
              답변이 완료되었거나 종료된 문의는 수정할 수 없습니다.
            </p>
            <Link
              href={`/inquiries/${inquiry.inquiryId}`}
              className="inline-flex items-center justify-center rounded-xl font-bold h-11 px-4 text-base bg-slate-900 text-white hover:bg-slate-800 shadow-sm hover:shadow-md shadow-slate-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 active:scale-[0.98]"
            >
              문의 상세로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
