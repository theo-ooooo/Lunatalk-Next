"use client";

import { useState } from "react";
import {
  InquiryCreateRequest,
  InquiryUpdateRequest,
  InquiryResponse,
} from "@/types/api";

interface UseInquiryFormProps {
  initialData?: InquiryResponse;
  initialType?: "PRODUCT" | "ORDER" | "GENERAL";
  initialOrderNumber?: string;
  onSubmit?: (
    data: InquiryCreateRequest | InquiryUpdateRequest
  ) => void | Promise<void>;
  onCreate?: (data: InquiryCreateRequest) => void | Promise<void>;
  onUpdate?: (data: InquiryUpdateRequest) => void | Promise<void>;
}

export function useInquiryForm({
  initialData,
  initialType,
  initialOrderNumber,
  onSubmit,
  onCreate,
  onUpdate,
}: UseInquiryFormProps) {
  const [type, setType] = useState<"PRODUCT" | "ORDER" | "GENERAL">(
    initialData?.type || initialType || "GENERAL"
  );
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [selectedProductId, setSelectedProductId] = useState<
    number | undefined
  >(initialData?.referenceId);
  const [selectedProductName, setSelectedProductName] = useState<string>("");
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string>(
    initialOrderNumber || ""
  );

  const handleTypeChange = (newType: "PRODUCT" | "ORDER" | "GENERAL") => {
    setType(newType);
    setSelectedProductId(undefined);
    setSelectedProductName("");
    setSelectedOrderNumber("");
  };

  const handleProductSelect = (productId: number, productName: string) => {
    setSelectedProductId(productId);
    setSelectedProductName(productName);
  };

  const handleOrderSelect = (orderNumber: string) => {
    setSelectedOrderNumber(orderNumber);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (initialData) {
      // 수정
      const updateData: InquiryUpdateRequest = { title, content };
      if (onUpdate) {
        onUpdate(updateData);
      } else if (onSubmit) {
        onSubmit(updateData);
      }
    } else {
      // 생성
      const createData: InquiryCreateRequest = {
        type,
        title,
        content,
      };

      if (type === "PRODUCT" && selectedProductId) {
        createData.referenceId = selectedProductId;
      } else if (type === "ORDER" && selectedOrderNumber) {
        createData.orderNumber = selectedOrderNumber;
      }

      if (onCreate) {
        onCreate(createData);
      } else if (onSubmit) {
        onSubmit(createData);
      }
    }
  };

  const isFormValid = initialData
    ? title.trim() !== "" && content.trim() !== ""
    : title.trim() !== "" &&
      content.trim() !== "" &&
      (type === "GENERAL" ||
        (type === "PRODUCT" && selectedProductId) ||
        (type === "ORDER" && selectedOrderNumber));

  return {
    // 상태
    type,
    title,
    content,
    selectedProductId,
    selectedProductName,
    selectedOrderNumber,
    // 핸들러
    setType: handleTypeChange,
    setTitle,
    setContent,
    handleProductSelect,
    handleOrderSelect,
    handleSubmit,
    // 유효성 검사
    isFormValid,
  };
}
