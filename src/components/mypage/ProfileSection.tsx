import Link from "next/link";
import { User, Edit } from "lucide-react";
import { Member } from "@/types/api";

interface ProfileSectionProps {
  member: Member;
}

export function ProfileSection({ member }: ProfileSectionProps) {
  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <User className="w-12 h-12" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {member.nickname || member.username}님
            </h2>
            <p className="text-slate-300 mb-3">{member.email}</p>
            <div className="flex items-center gap-3">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium">
                일반 회원
              </span>
              <span className="text-slate-300 text-sm">
                가입일: {new Date(member.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <Link
          href="/mypage/edit"
          className="flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors text-sm font-medium"
        >
          <Edit className="w-4 h-4" />
          <span>정보 수정</span>
        </Link>
      </div>
    </div>
  );
}

