"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ProductSearchInputProps {
  variant?: "header" | "page" | "mobile";
  autoFocus?: boolean;
  className?: string;
}

export default function ProductSearchInput({
  variant = "page",
  autoFocus = false,
  className,
}: ProductSearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleClear = () => {
    setQuery("");
    // 옵션: 검색어 지웠을 때 결과 초기화하려면 아래 주석 해제
    // router.push("/search");
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      <Search
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400",
          variant === "header" || variant === "mobile" ? "w-4 h-4" : "w-5 h-5"
        )}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어를 입력하세요"
        className={cn(
          "w-full bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 transition-colors",
          // Naver Shopping 느낌: 흰 배경 + 연한 테두리, 정보 밀도 높게
          variant === "header"
            ? "h-10 pl-10 pr-10 border border-slate-900 rounded-full text-sm font-medium"
            : variant === "mobile"
            ? "h-10 pl-10 pr-10 border border-slate-200 rounded-md text-sm font-medium focus:border-slate-400"
            : "h-14 pl-12 pr-12 border border-slate-200 rounded-2xl text-lg font-medium focus:border-slate-900"
        )}
        autoFocus={autoFocus}
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-slate-500 rounded-full hover:bg-slate-100 transition-colors",
            (variant === "header" || variant === "mobile") && "right-2"
          )}
        >
          <X
            className={cn(
              variant === "header" || variant === "mobile"
                ? "w-4 h-4"
                : "w-5 h-5"
            )}
          />
        </button>
      )}
    </form>
  );
}
