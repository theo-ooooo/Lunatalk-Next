import { MessageSquare, Plus } from "lucide-react";
import Link from "next/link";

export function InquiryPageHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
        <MessageSquare className="w-6 h-6" />
        문의 내역
      </h1>
      <Link
        href="/inquiries/create"
        className="inline-flex items-center justify-center rounded-xl font-bold h-11 px-4 text-base bg-slate-900 text-white hover:bg-slate-800 shadow-sm hover:shadow-md shadow-slate-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 active:scale-[0.98]"
      >
        <Plus className="w-4 h-4 mr-1" />
        문의하기
      </Link>
    </div>
  );
}
