"use client";

import { Button } from "@/components/ui/Button";

type Item =
  | { type: "page"; page: number }
  | { type: "ellipsis"; key: string };

function buildItems(currentPage: number, totalPages: number): Item[] {
  // 0-based currentPage, totalPages >= 1
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => ({ type: "page", page: i }));
  }

  const last = totalPages - 1;
  const items: Item[] = [{ type: "page", page: 0 }];

  const start = Math.max(1, currentPage - 1);
  const end = Math.min(last - 1, currentPage + 1);

  if (start > 1) items.push({ type: "ellipsis", key: "left" });

  for (let p = start; p <= end; p += 1) {
    items.push({ type: "page", page: p });
  }

  if (end < last - 1) items.push({ type: "ellipsis", key: "right" });

  items.push({ type: "page", page: last });
  return items;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const safeCurrent = Math.min(Math.max(0, currentPage), totalPages - 1);
  const items = buildItems(safeCurrent, totalPages);

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(0, safeCurrent - 1))}
        disabled={safeCurrent === 0}
      >
        이전
      </Button>

      <div className="flex items-center gap-1">
        {items.map((it) => {
          if (it.type === "ellipsis") {
            return (
              <span
                key={it.key}
                className="px-2 text-sm text-slate-400 select-none"
              >
                …
              </span>
            );
          }

          const active = it.page === safeCurrent;
          return (
            <Button
              key={it.page}
              variant={active ? "primary" : "outline"}
              size="sm"
              className="w-9 px-0"
              onClick={() => onPageChange(it.page)}
              aria-current={active ? "page" : undefined}
            >
              {it.page + 1}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages - 1, safeCurrent + 1))}
        disabled={safeCurrent >= totalPages - 1}
      >
        다음
      </Button>
    </div>
  );
}


