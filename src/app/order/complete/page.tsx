'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function OrderCompletePage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');

  return (
    <div className="container mx-auto px-4 py-32 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-8">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold mb-4">주문이 완료되었습니다!</h1>
      <p className="text-slate-500 mb-8">
        주문번호: <span className="font-bold text-slate-900">{orderNumber}</span><br />
        주문해주셔서 감사합니다. 빠른 배송을 위해 노력하겠습니다.
      </p>
      
      <div className="flex justify-center gap-4">
        <Link 
          href="/mypage" 
          className="px-6 py-3 bg-white border border-slate-300 rounded-lg font-medium hover:bg-slate-50"
        >
          주문 내역 확인
        </Link>
        <Link 
          href="/" 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          쇼핑 계속하기
        </Link>
      </div>
    </div>
  );
}


