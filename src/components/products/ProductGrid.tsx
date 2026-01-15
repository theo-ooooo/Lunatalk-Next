import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  title: string;
  subtitle?: string;
  moreHref?: string;
  moreLabel?: string;
  className?: string;
  children: React.ReactNode;
}

export default function ProductGrid({
  title,
  subtitle,
  moreHref,
  moreLabel = "더보기",
  className,
  children,
}: ProductGridProps) {
  return (
    <section className={cn("py-8 md:py-10", className)}>
      <div className="flex items-end justify-between mb-4">
        <div className="min-w-0">
          <h2 className="text-[18px] md:text-[20px] font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs md:text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        {moreHref && (
          <Link
            href={moreHref}
            className="text-xs md:text-sm font-semibold text-slate-500 hover:text-slate-900"
          >
            {moreLabel}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}


