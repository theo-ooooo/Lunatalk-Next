import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickMenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
  color: string;
  disabled?: boolean;
}

interface QuickMenuProps {
  items: QuickMenuItem[];
  columns?: 3 | 6;
}

export function QuickMenu({ items, columns = 6 }: QuickMenuProps) {
  const gridCols = columns === 3 ? "grid-cols-3" : "grid-cols-3 md:grid-cols-6";

  return (
    <section className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-6">
      <div className="px-4 sm:px-6 py-4 border-b border-slate-200">
        <h3 className="text-sm font-extrabold text-slate-900">빠른 메뉴</h3>
      </div>
      <div
        className={cn("grid", gridCols, "divide-x divide-y divide-slate-200")}
      >
        {items.map((item, idx) => {
          const Icon = item.icon;
          if (item.disabled) {
            return (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 p-4 relative opacity-50 cursor-not-allowed bg-white"
              >
                <div className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700">
                  {item.label}
                </span>
                <span className="absolute top-2 right-2 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  준비중
                </span>
              </div>
            );
          }
          return (
            <Link
              key={idx}
              href={item.href}
              className="flex flex-col items-center gap-2 p-4 bg-white hover:bg-slate-50 transition-colors group cursor-pointer relative"
            >
              <div className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 group-hover:border-slate-400 transition-colors">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-800">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
