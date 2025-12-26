import Link from "next/link";
import { LucideIcon } from "lucide-react";

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
    <div className="bg-white rounded-xl p-6 border border-slate-200">
      <h3 className="text-lg font-bold mb-4 text-slate-900">빠른 메뉴</h3>
      <div className={`grid ${gridCols} gap-4`}>
        {items.map((item, idx) => {
          const Icon = item.icon;
          if (item.disabled) {
            return (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 p-4 rounded-lg relative opacity-50 cursor-not-allowed"
              >
                <div
                  className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {item.label}
                </span>
                <span className="absolute top-1 right-1 text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                  준비중
                </span>
              </div>
            );
          }
          return (
            <Link
              key={idx}
              href={item.href}
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer relative"
            >
              <div
                className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-slate-700">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

