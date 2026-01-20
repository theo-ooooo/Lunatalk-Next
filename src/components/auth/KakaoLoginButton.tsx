"use client";

import { useKakaoLogin } from "@/hooks/auth/useKakaoLogin";

export function KakaoLoginButton() {
  const { handleKakaoLogin } = useKakaoLogin();

  return (
    <button
      type="button"
      onClick={handleKakaoLogin}
      className="w-full flex items-center justify-center gap-2 h-11 px-4 border border-yellow-300 bg-[#FEE500] text-slate-900 rounded-lg font-extrabold hover:bg-[#FDD835] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 0C4.03 0 0 3.27 0 7.3c0 2.55 1.7 4.8 4.25 6.1L3 18l5.25-2.9c.5.05 1 .1 1.5.1 4.97 0 9-3.27 9-7.3S13.97 0 9 0z"
          fill="#000000"
        />
      </svg>
      카카오로 시작하기
    </button>
  );
}
