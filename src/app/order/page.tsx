'use client';

import { useOrderStore } from '@/store/useOrderStore';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { orderApi } from '@/services/api';

export default function OrderPage() {
  const { orderItems, clearOrder } = useOrderStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 배송지 정보
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    zipCode: '',
    address1: '',
    address2: '',
    message: '',
  });

  useEffect(() => {
    if (orderItems.length === 0) {
      alert('주문할 상품이 없습니다.');
      router.replace('/cart');
    }
  }, [orderItems, router]);

  const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePayment = async () => {
    // 유효성 검사
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address1) {
      alert('배송지 정보를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      // 1. 주문 생성 API 호출
      const orderResponse = await orderApi.createOrder({
        "구매할 상품들": orderItems.map(item => ({
          "상품 ID": item.productId,
          "상품 갯수": item.quantity,
          "상품 옵션": { color: "DEFAULT" } // 옵션이 필수라면 임시값
        }))
      });

      // 2. 결제 승인 (PG 연동 생략하고 바로 승인 API 호출 시뮬레이션)
      // 실제로는 여기서 Toss Payments SDK 실행 -> 성공 콜백 URL에서 confirm 호출해야 함.
      // 여기서는 주문 완료 페이지로 넘기고 거기서 처리하거나, 주문 생성까지만 하고 끝냄.
      
      // API 명세상 주문 생성 시 orderId(관리자용)와 orderNumber(회원용 문자열) 반환됨.
      // orderResponse: { 회원용_주문번호: string, 관리자용_주문번호: number }
      
      const orderNumber = orderResponse.회원용_주문번호;

      // 주문 완료 페이지로 이동
      clearOrder(); // 주문 상품 비우기
      router.push(`/order/complete?orderNumber=${orderNumber}`);

    } catch (error) {
      alert('주문 생성에 실패했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  if (orderItems.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">주문/결제</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Shipping & Items */}
        <div className="flex-1 space-y-8">
          {/* Shipping Info */}
          <section className="bg-white p-6 rounded-xl border">
            <h2 className="text-lg font-bold mb-4">배송지 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">받는 분</label>
                <input
                  name="name"
                  value={shippingInfo.name}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="이름"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">연락처</label>
                <input
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="010-0000-0000"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">주소</label>
                <div className="flex gap-2 mb-2">
                  <input
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleChange}
                    className="w-32 border rounded-lg px-3 py-2"
                    placeholder="우편번호"
                  />
                  <button className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm">
                    우편번호 찾기
                  </button>
                </div>
                <input
                  name="address1"
                  value={shippingInfo.address1}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mb-2"
                  placeholder="기본 주소"
                />
                <input
                  name="address2"
                  value={shippingInfo.address2}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="상세 주소"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">배송 메모</label>
                <input
                  name="message"
                  value={shippingInfo.message}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="배송 기사님께 전달할 메시지를 입력해주세요."
                />
              </div>
            </div>
          </section>

          {/* Order Items */}
          <section className="bg-white p-6 rounded-xl border">
            <h2 className="text-lg font-bold mb-4">주문 상품 ({orderItems.length})</h2>
            <div className="space-y-4">
              {orderItems.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-md overflow-hidden flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={getImageUrl(item.imageUrl)} 
                      alt={item.productName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.productName}</h3>
                    <p className="text-sm text-slate-500">수량: {item.quantity}개</p>
                    <p className="font-bold">{formatPrice(item.price * item.quantity)}원</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Payment */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-slate-50 p-6 rounded-xl sticky top-24">
            <h3 className="font-bold text-lg mb-4">결제 정보</h3>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-600">총 상품금액</span>
                <span className="font-bold">{formatPrice(totalAmount)}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">배송비</span>
                <span className="font-bold">0원</span>
              </div>
            </div>
            <div className="border-t pt-4 mb-6 flex justify-between items-center">
              <span className="font-bold text-lg">최종 결제금액</span>
              <span className="font-bold text-xl text-blue-600">{formatPrice(totalAmount)}원</span>
            </div>
            
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? '결제 처리 중...' : '결제하기'}
            </button>
            <p className="text-xs text-slate-400 mt-4 text-center">
              위 내용은 모의 결제이며 실제 비용은 청구되지 않습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

