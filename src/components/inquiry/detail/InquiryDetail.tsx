"use client";

import { InquiryResponse } from "@/types/api";
import { MessageSquare, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useDeleteInquiry } from "@/hooks/inquiry/useDeleteInquiry";
import { useModalStore } from "@/store/useModalStore";

interface InquiryDetailProps {
  inquiry: InquiryResponse;
  canEdit?: boolean;
}

const getTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    PRODUCT: "상품문의",
    ORDER: "주문문의",
    GENERAL: "일반문의",
  };
  return typeMap[type] || type;
};

const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    PENDING: "대기중",
    ANSWERED: "답변완료",
    CLOSED: "종료",
  };
  return statusMap[status] || status;
};

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    ANSWERED: "bg-green-100 text-green-700",
    CLOSED: "bg-slate-100 text-slate-700",
  };
  return colorMap[status] || "bg-slate-100 text-slate-600";
};

export function InquiryDetail({
  inquiry,
  canEdit = true,
}: InquiryDetailProps) {
  const { deleteInquiry, isPending: isDeleting } = useDeleteInquiry();
  const { openModal, closeModal } = useModalStore();

  const handleDelete = () => {
    openModal({
      title: "문의 삭제",
      content: (
        <div className="text-center">
          <p>정말 이 문의를 삭제하시겠습니까?</p>
          <p className="text-sm text-slate-500 mt-2">
            삭제된 문의는 복구할 수 없습니다.
          </p>
        </div>
      ),
      footer: (
        <div className="flex gap-2">
          <Button variant="outline" fullWidth onClick={closeModal}>
            취소
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              deleteInquiry(inquiry.inquiryId);
              closeModal();
            }}
            disabled={isDeleting}
          >
            삭제
          </Button>
        </div>
      ),
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`px-3 py-1 rounded text-sm font-medium bg-blue-50 text-blue-700`}
            >
              {getTypeLabel(inquiry.type)}
            </span>
            <span
              className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(
                inquiry.status
              )}`}
            >
              {getStatusLabel(inquiry.status)}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {inquiry.title}
          </h1>
          {inquiry.referenceName && (
            <p className="text-sm text-slate-500 mb-2">
              관련: {inquiry.referenceName}
            </p>
          )}
          <p className="text-sm text-slate-400">
            {new Date(inquiry.createdAt).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        {canEdit && inquiry.status === "PENDING" && (
          <div className="flex gap-2">
            <Link href={`/inquiries/${inquiry.inquiryId}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-1" />
                수정
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              삭제
            </Button>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 pt-6 mb-6">
        <div className="prose max-w-none">
          <p className="text-slate-700 whitespace-pre-wrap">
            {inquiry.content}
          </p>
        </div>
      </div>

      {inquiry.reply && (
        <div className="border-t border-slate-200 pt-6">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-green-900">답변</h3>
            </div>
            <p className="text-slate-700 whitespace-pre-wrap">
              {inquiry.reply.content}
            </p>
            <p className="text-xs text-slate-500 mt-3">
              {new Date(inquiry.reply.createdAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

