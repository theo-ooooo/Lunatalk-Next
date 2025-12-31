"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inquiryApi } from "@/services/api";
import { useModalStore } from "@/store/useModalStore";
import { Button } from "@/components/ui/Button";

export function useDeleteInquiry() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModalStore();

  const mutation = useMutation({
    mutationFn: (inquiryId: number) => inquiryApi.deleteInquiry(inquiryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      openModal({
        title: "문의 삭제 완료",
        content: (
          <div className="text-center">
            <p>문의가 성공적으로 삭제되었습니다.</p>
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
        title: "문의 삭제 실패",
        content: (
          <div className="text-center">
            <p>{error.message || "문의 삭제에 실패했습니다."}</p>
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
    deleteInquiry: mutation.mutate,
    isPending: mutation.isPending,
  };
}

