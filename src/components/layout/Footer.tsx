export default function Footer() {
  return (
    <footer className="bg-[#f9fafb] border-t border-gray-100 py-10 md:py-14 pb-24 md:pb-14">
      <div className="container mx-auto px-6 md:px-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Logo & Copyright */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-800">LUNATALK</h2>
            <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
              Copyright © LUNATALK Corp.<br className="md:hidden" /> All rights reserved.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 md:text-right">
            <h3 className="text-sm font-bold text-slate-800">고객센터</h3>
            <div className="flex flex-col md:items-end gap-1.5 text-[13px] text-slate-500 font-medium">
              <a href="tel:1544-0000" className="hover:text-slate-900 transition-colors w-fit">
                1544-0000
              </a>
              <a href="mailto:cs@lunatalk.co.kr" className="hover:text-slate-900 transition-colors w-fit">
                cs@lunatalk.co.kr
              </a>
              <span className="text-slate-400">평일 09:00 - 18:00 (주말/공휴일 휴무)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
