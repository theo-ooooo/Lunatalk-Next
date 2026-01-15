"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export function useProductLike(
  productId: number,
  initial?: { isLiked?: boolean; likeCount?: number }
) {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const { openModal, closeModal } = useModalStore();
  const router = useRouter();

  // 상태조회 API가 없으므로, 초기값 + optimistic 토글로 UI 상태를 관리
  const [isLiked, setIsLiked] = useState<boolean>(initial?.isLiked ?? false);
  const [likeCount, setLikeCount] = useState<number>(initial?.likeCount ?? 0);

  useEffect(() => {
    setIsLiked(initial?.isLiked ?? false);
    setLikeCount(initial?.likeCount ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, initial?.isLiked, initial?.likeCount]);

  // 좋아요 토글 mutation (DELETE 없음)
  const toggleLikeMutation = useMutation({
    mutationFn: () => productApi.toggleLike(productId),
    onMutate: async () => {
      const prev = { isLiked, likeCount };
      const nextIsLiked = !isLiked;
      setIsLiked(nextIsLiked);
      setLikeCount((c) => Math.max(0, c + (nextIsLiked ? 1 : -1)));

      // 네트워크 재조회(invalidate) 대신 캐시를 직접 갱신해서 다른 화면/목록에도 즉시 반영
      queryClient.setQueryData(["product", productId], (old: any) => {
        if (!old || typeof old !== "object") return old;
        const oldIsLiked = !!old.isLiked;
        const next = !oldIsLiked;
        const oldCount = Number(old.likeCount ?? 0);
        return {
          ...old,
          isLiked: next,
          likeCount: Math.max(0, oldCount + (next ? 1 : -1)),
        };
      });

      queryClient.setQueriesData({ queryKey: ["products"] }, (old: any) => {
        if (!old || typeof old !== "object") return old;

        // PageProductFindResponse 형태 (content 배열)
        if (Array.isArray(old.content)) {
          return {
            ...old,
            content: old.content.map((p: any) => {
              if (!p || typeof p !== "object") return p;
              if (p.productId !== productId) return p;
              const oldIsLiked = !!p.isLiked;
              const next = !oldIsLiked;
              const oldCount = Number(p.likeCount ?? 0);
              return {
                ...p,
                isLiked: next,
                likeCount: Math.max(0, oldCount + (next ? 1 : -1)),
              };
            }),
          };
        }

        // 단일 상품 형태
        if (old.productId === productId) {
          const oldIsLiked = !!old.isLiked;
          const next = !oldIsLiked;
          const oldCount = Number(old.likeCount ?? 0);
          return {
            ...old,
            isLiked: next,
            likeCount: Math.max(0, oldCount + (next ? 1 : -1)),
          };
        }

        return old;
      });

      return prev;
    },
    onError: (error, _vars, context) => {
      if (context) {
        setIsLiked(context.isLiked);
        setLikeCount(context.likeCount);

        // 캐시도 롤백
        queryClient.setQueryData(["product", productId], (old: any) => {
          if (!old || typeof old !== "object") return old;
          return {
            ...old,
            isLiked: context.isLiked,
            likeCount: context.likeCount,
          };
        });

        queryClient.setQueriesData({ queryKey: ["products"] }, (old: any) => {
          if (!old || typeof old !== "object") return old;
          if (Array.isArray(old.content)) {
            return {
              ...old,
              content: old.content.map((p: any) => {
                if (!p || typeof p !== "object") return p;
                if (p.productId !== productId) return p;
                return {
                  ...p,
                  isLiked: context.isLiked,
                  likeCount: context.likeCount,
                };
              }),
            };
          }
          if (old.productId === productId) {
            return {
              ...old,
              isLiked: context.isLiked,
              likeCount: context.likeCount,
            };
          }
          return old;
        });
      }
      console.error("좋아요 토글 실패:", error);
      openModal({
        title: "오류",
        content: <p>좋아요 처리에 실패했습니다. 다시 시도해주세요.</p>,
        footer: (
          <Button variant="primary" fullWidth onClick={closeModal}>
            확인
          </Button>
        ),
      });
    },
  });

  const handleToggleLike = () => {
    if (!isAuthenticated) {
      openModal({
        title: "로그인 필요",
        content: (
          <div className="text-center">
            <p>좋아요는 로그인이 필요한 서비스입니다.</p>
            <p className="mt-1 text-sm text-slate-400">
              로그인 페이지로 이동하시겠습니까?
            </p>
          </div>
        ),
        footer: (
          <div className="flex gap-2 w-full">
            <Button variant="outline" fullWidth onClick={closeModal}>
              취소
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                closeModal();
                router.push(`/login?redirect=/products/${productId}`);
              }}
            >
              로그인하기
            </Button>
          </div>
        ),
      });
      return;
    }

    toggleLikeMutation.mutate();
  };

  return {
    isLiked,
    likeCount,
    isToggling: toggleLikeMutation.isPending,
    handleToggleLike,
  };
}
