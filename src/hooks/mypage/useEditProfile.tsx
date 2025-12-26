"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/services/api";
import { useModalStore } from "@/store/useModalStore";
import { Button } from "@/components/ui/Button";

export function useEditProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModalStore();

  const { data: me } = useSuspenseQuery({
    queryKey: ["me"],
    queryFn: authApi.getMe,
  });

  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (me) {
      setFormData({
        nickname: me.nickname || "",
        email: me.email || "",
        phone: me.phone || "",
      });
    }
  }, [me]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: {
      nickname?: string;
      email?: string;
      phone?: string;
    }) => {
      // TODO: API가 준비되면 실제 API 호출로 변경
      // return authApi.updateProfile(data);
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      openModal({
        title: "수정 완료",
        content: (
          <div className="text-center">
            <p>회원 정보가 수정되었습니다.</p>
          </div>
        ),
        footer: (
          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              closeModal();
              router.push("/mypage");
            }}
          >
            확인
          </Button>
        ),
      });
    },
    onError: (error: any) => {
      openModal({
        title: "수정 실패",
        content: (
          <div className="text-center">
            <p>{error.message || "회원 정보 수정에 실패했습니다."}</p>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!me) {
    throw new Error("로그인이 필요합니다.");
  }

  return {
    me,
    formData,
    isPending: updateProfileMutation.isPending,
    handleSubmit,
    handleChange,
  };
}

