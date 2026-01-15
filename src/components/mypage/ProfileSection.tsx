import Link from "next/link";
import { User, Edit } from "lucide-react";
import { Member } from "@/types/api";

interface ProfileSectionProps {
  member: Member;
}

export function ProfileSection({ member }: ProfileSectionProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 md:gap-6 min-w-0">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center border border-slate-200 shrink-0">
            <User className="w-7 h-7 md:w-8 md:h-8 text-slate-600" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[18px] md:text-[22px] font-extrabold text-slate-900 leading-tight">
              {member.nickname || member.username}님
            </h2>
            <p className="text-sm text-slate-500 mt-1 truncate">{member.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-500">
              <span className="px-2.5 py-1 rounded-full border border-slate-200 bg-white font-semibold text-slate-700">
                일반 회원
              </span>
              <span className="text-slate-400">·</span>
              <span>
                가입일: {new Date(member.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <Link
          href="/mypage/edit"
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-800 hover:border-slate-400 transition-colors text-sm font-semibold shrink-0"
        >
          <Edit className="w-4 h-4" />
          <span>정보 수정</span>
        </Link>
      </div>
    </div>
  );
}

