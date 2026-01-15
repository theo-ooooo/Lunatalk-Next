export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-10 md:pt-12 pb-24 md:pb-14">
      <div className="container mx-auto px-6 md:px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="text-sm font-extrabold text-slate-900">LUNATALK</div>
            <p className="mt-2 text-[12px] leading-relaxed text-slate-500">
              루나톡 쇼핑몰
              <br />
              Copyright © LUNATALK Corp. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-4">
            <div className="text-[12px] font-semibold text-slate-700">안내</div>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-[12px] text-slate-500">
              <a href="/inquiries" className="hover:text-slate-900">
                문의하기
              </a>
              <a href="/orders" className="hover:text-slate-900">
                주문/배송 조회
              </a>
              <a href="/wishlist" className="hover:text-slate-900">
                관심상품
              </a>
              <a href="/mypage" className="hover:text-slate-900">
                마이페이지
              </a>
            </div>
          </div>

          {/* CS */}
          <div className="md:col-span-4 md:text-right">
            <div className="text-[12px] font-semibold text-slate-700">고객센터</div>
            <div className="mt-2 space-y-1.5 text-[12px] text-slate-500">
              <div>
                <a href="tel:1544-0000" className="hover:text-slate-900">
                  1544-0000
                </a>
              </div>
              <div>
                <a href="mailto:cs@lunatalk.co.kr" className="hover:text-slate-900">
                  cs@lunatalk.co.kr
                </a>
              </div>
              <div className="text-slate-400">
                평일 09:00 - 18:00 (주말/공휴일 휴무)
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-[11px] text-slate-400">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              상호: LUNATALK · 대표: (미기재) · 사업자등록번호: (미기재)
            </div>
            <div>통신판매업신고: (미기재) · 주소: (미기재)</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
