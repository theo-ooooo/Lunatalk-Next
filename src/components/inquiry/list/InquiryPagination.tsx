"use client";

import { Button } from "@/components/ui/Button";

interface InquiryPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function InquiryPagination({
  currentPage,
  totalPages,
  onPageChange,
}: InquiryPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-6">
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
      >
        이전
      </Button>
      <span className="px-4 py-2 text-slate-700">
        {currentPage + 1} / {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage >= totalPages - 1}
      >
        다음
      </Button>
    </div>
  );
}

