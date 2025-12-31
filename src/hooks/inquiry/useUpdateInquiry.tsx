"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inquiryApi } from "@/services/api";
import { InquiryUpdateRequest } from "@/types/api";
import { useModalStore } from "@/store/useModalStore";
import { Button } from "@/components/ui/Button";

export function useUpdateInquiry(inquiryId: number) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModalStore();

  const mutation = useMutation({
    mutationFn: (data: InquiryUpdateRequest) =>
      inquiryApi.updateInquiry(inquiryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["inquiry", inquiryId] });
      openModal({
        title: "문의 수정 완료",
        content: (
          <div className="text-center">
            <p>문의가 성공적으로 수정되었습니다.</p>
          </div>
        ),
        footer: (
          <Button variant="primary" fullWidth onClick={closeModal}>
            확인
          </Button>
        ),
      });
      router.push(`/inquiries/${inquiryId}`);
    },
    onError: (error: Error) => {
      openModal({
        title: "문의 수정 실패",
        content: (
          <div className="text-center">
            <p>{error.message || "문의 수정에 실패했습니다."}</p>
          </div>
        ),
        footer: (
          <Button variant="primary" fullWidth onClick={closeModal}>
            확인
          </Button>
        ),
      });
    },
  });

  return {
    updateInquiry: mutation.mutate,
    isPending: mutation.isPending,
  };
}

