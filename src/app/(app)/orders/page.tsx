"use client";

import { Loading } from "@/components/common/Loading";
import { Button } from "@/components/ui/Button";
import OrderListTable from "@/components/order/OrderListTable";
import { ORDER_STATUS_OPTIONS, useOrdersPage } from "@/hooks/order/useOrdersPage";

export default function OrdersPage() {
  const {
    isAuthenticated,
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    isSearching,
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
    filtered,
  } = useOrdersPage();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <Loading message="로그인 페이지로 이동 중..." fullScreen={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-4 md:py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-4 md:mb-6 flex items-end justify-between gap-3">
          <div>
            <h1 className="text-[18px] md:text-[22px] font-extrabold text-slate-900">
              주문 내역
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              주문번호/상품명으로 검색할 수 있어요.
            </p>
          </div>
          {isFetching && (
            <span className="text-xs text-slate-400">불러오는 중…</span>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-7">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                검색
              </label>
              <input
                value={query}
                onChange={(e) => {
                  setPage(0);
                  setQuery(e.target.value);
                }}
                placeholder="주문번호 또는 상품명"
                className="w-full h-11 px-4 rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-0"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                상태
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setPage(0);
                  setStatusFilter(e.target.value as any);
                }}
                className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white focus:border-slate-900 focus:ring-0"
              >
                {ORDER_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.label} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 flex items-end gap-2">
              <Button
                variant="outline"
                className="h-11 w-full"
                onClick={() => {
                  setQuery("");
                  setStatusFilter("");
                  setPage(0);
                }}
              >
                초기화
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <Loading message="주문 내역을 불러오는 중..." fullScreen={false} />
        ) : isError ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
            <p className="text-slate-500 mb-4">
              주문 내역을 불러오지 못했습니다.
            </p>
            <Button onClick={() => refetch()}>다시 시도</Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
            <p className="text-slate-700 font-semibold mb-2">
              주문 내역이 없습니다.
            </p>
            <p className="text-sm text-slate-500">다른 조건으로 검색해보세요.</p>
          </div>
        ) : (
          <>
            <OrderListTable orders={filtered} />

            {!isSearching && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  이전
                </Button>
                <span className="text-sm text-slate-600 px-2">
                  {page + 1} / {data?.totalPages ?? 1}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={data?.last ?? true}
                >
                  다음
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


