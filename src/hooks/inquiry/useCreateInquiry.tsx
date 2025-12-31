"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inquiryApi } from "@/services/api";
import { InquiryCreateRequest } from "@/types/api";
import { useModalStore } from "@/store/useModalStore";
import { Button } from "@/components/ui/Button";

export function useCreateInquiry() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModalStore();
  const [isPending, setIsPending] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: InquiryCreateRequest) => inquiryApi.createInquiry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      openModal({
        title: "문의 등록 완료",
        content: (
          <div className="text-center">
            <p>문의가 성공적으로 등록되었습니다.</p>
          </div>
        ),
        footer: (
          <Button variant="primary" fullWidth onClick={closeModal}>
            확인
          </Button>
        ),
      });
      router.push("/inquiries");
    },
    onError: (error: Error) => {
      openModal({
        title: "문의 등록 실패",
        content: (
          <div className="text-center">
            <p>{error.message || "문의 등록에 실패했습니다."}</p>
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
    createInquiry: mutation.mutate,
    isPending: mutation.isPending,
  };
}
