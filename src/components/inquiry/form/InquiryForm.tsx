"use client";

import {
  InquiryResponse,
  InquiryCreateRequest,
  InquiryUpdateRequest,
} from "@/types/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProductSelector } from "./ProductSelector";
import { OrderSelector } from "./OrderSelector";
import { useInquiryForm } from "@/hooks/inquiry/useInquiryForm";

interface InquiryFormProps {
  initialData?: InquiryResponse;
  initialType?: "PRODUCT" | "ORDER" | "GENERAL";
  initialOrderNumber?: string;
  onSubmit?: (
    data: InquiryCreateRequest | InquiryUpdateRequest
  ) => void | Promise<void>;
  onCreate?: (data: InquiryCreateRequest) => void | Promise<void>;
  onUpdate?: (data: InquiryUpdateRequest) => void | Promise<void>;
  isPending?: boolean;
}

export function InquiryForm({
  initialData,
  initialType,
  initialOrderNumber,
  onSubmit,
  onCreate,
  onUpdate,
  isPending = false,
}: InquiryFormProps) {
  const {
    type,
    title,
    content,
    selectedProductId,
    selectedProductName,
    selectedOrderNumber,
    setType,
    setTitle,
    setContent,
    handleProductSelect,
    handleOrderSelect,
    handleSubmit,
    isFormValid,
  } = useInquiryForm({
    initialData,
    initialType,
    initialOrderNumber,
    onSubmit,
    onCreate,
    onUpdate,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!initialData && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            문의 유형
          </label>
          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value as "PRODUCT" | "ORDER" | "GENERAL")
            }
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            required
          >
            <option value="GENERAL">일반문의</option>
            <option value="PRODUCT">상품문의</option>
            <option value="ORDER">주문문의</option>
          </select>
        </div>
      )}

      {!initialData && type === "PRODUCT" && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            상품 선택
          </label>
          {selectedProductId && (
            <div className="mb-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600">
                선택된 상품:{" "}
                <span className="font-medium text-slate-900">
                  {selectedProductName}
                </span>
              </p>
            </div>
          )}
          <div className="border border-slate-200 rounded-lg p-4 bg-white">
            <ProductSelector
              selectedProductId={selectedProductId}
              onSelect={handleProductSelect}
            />
          </div>
        </div>
      )}

      {!initialData && type === "ORDER" && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            주문 선택
          </label>
          {selectedOrderNumber && (
            <div className="mb-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600">
                선택된 주문:{" "}
                <span className="font-medium text-slate-900">
                  {selectedOrderNumber}
                </span>
              </p>
            </div>
          )}
          <div className="border border-slate-200 rounded-lg p-4 bg-white">
            <OrderSelector
              selectedOrderNumber={selectedOrderNumber}
              onSelect={handleOrderSelect}
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          제목
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="문의 제목을 입력하세요"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          내용
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="문의 내용을 입력하세요"
          required
          rows={10}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
        />
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isPending || !isFormValid}
        >
          {isPending ? "처리 중..." : initialData ? "수정하기" : "등록하기"}
        </Button>
      </div>
    </form>
  );
}
