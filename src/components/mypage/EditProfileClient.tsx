"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEditProfile } from "@/hooks/mypage/useEditProfile";

export default function EditProfileClient() {
  const router = useRouter();
  const { me, formData, isPending, handleSubmit, handleChange } =
    useEditProfile();

  return (
    <div className="min-h-screen bg-white py-10 md:py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link
          href="/mypage"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>마이페이지로 돌아가기</span>
        </Link>

        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <div className="pb-4 mb-6 border-b border-slate-100">
            <h1 className="text-[18px] md:text-[22px] font-extrabold text-slate-900">
              내 정보 수정
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                아이디
              </label>
              <input
                type="text"
                value={me.username}
                disabled
                className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-slate-400">
                아이디는 변경할 수 없습니다.
              </p>
            </div>

            <div>
              <label
                htmlFor="nickname"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                닉네임
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                value={formData.nickname}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-slate-500 focus:border-slate-500"
                placeholder="닉네임을 입력하세요"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-slate-500 focus:border-slate-500"
                placeholder="이메일을 입력하세요"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                휴대폰 번호
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="010-0000-0000"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-slate-500 focus:border-slate-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => router.back()}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isPending}
              >
                수정하기
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
