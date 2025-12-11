"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { XCircle } from "lucide-react";

export default function PaymentFailPage() {
  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const message = searchParams.get("message");
  
  useEffect(() => {
      if (window.opener) {
          // 약간의 지연 후 메시지 전송 (UI 렌더링 확인용)
          setTimeout(() => {
            window.opener.postMessage(
                { type: "PAYMENT_FAIL", message: message || "결제 실패", code },
                window.location.origin
            );
            window.close();
          }, 1500); // 1.5초 후 닫힘
      }
  }, [message, code]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
          <XCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">결제 실패</h1>
        <p className="text-slate-600 mb-6 font-medium">
          {message || "결제 진행 중 오류가 발생했습니다."}
        </p>
        <p className="text-xs text-slate-400">잠시 후 창이 닫힙니다.</p>
      </div>
    </div>
  );
}
