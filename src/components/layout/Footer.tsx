export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-10 md:pt-12 pb-24 md:pb-14">
      <div className="container mx-auto px-6 md:px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="text-[12px] font-semibold text-slate-700">
              주식회사 서진산업
            </div>
            <div className="mt-2 space-y-1.5 text-[12px] text-slate-500">
              <p>
                대표이사 : 강대용 / 경기도 부천시 원종로 131(고강동) 3층 서진산업
              </p>
              <p>
                사업자등록번호 : 130-86-59053 / 통신판매업 신고 : 2011-경기부천-1500
              </p>
              <p>
                개인정보보호책임자 : 강대용 /{" "}
                <a
                  href="mailto:lunatalk.helpper@gmail.com"
                  className="hover:text-slate-900"
                >
                  lunatalk.helpper@gmail.com
                </a>
              </p>
              <p className="text-slate-400 font-semibold">
                COPYRIGHT © LUNATALK ALL RIGHTS RESERVED.
              </p>
            </div>
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
                <a href="tel:032-684-1565" className="hover:text-slate-900">
                  032-684-1565
                </a>
              </div>
              <div>
                <a href="mailto:seojin_industry@naver.com" className="hover:text-slate-900">
                  seojin_industry@naver.com
                </a>
              </div>
              <div className="text-slate-400">
                평일 09:00 - 18:00 (주말/공휴일 휴무)
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
