import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/common/Loading";
import { QueryErrorBoundary } from "@/components/common/QueryErrorBoundary";
import EditProfileClient from "@/components/mypage/EditProfileClient";

// 인증이 필요한 페이지이므로 빌드 시 prerender 방지
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default function EditProfilePage() {
  return (
    <QueryErrorBoundary
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-500 mb-4">로그인이 필요합니다.</p>
            <Link href="/login">
              <Button>로그인하기</Button>
            </Link>
          </div>
        </div>
      }
    >
      <Suspense fallback={<Loading message="회원 정보를 불러오는 중..." />}>
        <EditProfileClient />
      </Suspense>
    </QueryErrorBoundary>
  );
}
