"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type BaseProps = {
  Icon: LucideIcon;
  ariaLabel: string;
  title?: string;
  className?: string;
  iconClassName?: string;
  badgeCount?: number;
  badgeMax?: number;
};

function Badge({ count, max = 99 }: { count?: number; max?: number }) {
  if (!count || count <= 0) return null;
  const text = count > max ? `${max}+` : String(count);
  return (
    <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-blue-600 text-white text-[10px] font-extrabold leading-[16px] text-center ring-2 ring-white">
      {text}
    </span>
  );
}

const baseButtonClass = "h-9 w-9 inline-flex items-center justify-center";
const baseIconClass = "w-5 h-5 stroke-[1.75] text-slate-900";

export function HeaderIconLink({
  href,
  Icon,
  ariaLabel,
  title,
  className,
  iconClassName,
  badgeCount,
  badgeMax,
}: BaseProps & { href: string }) {
  return (
    <Link
      href={href}
      className={cn(baseButtonClass, badgeCount ? "relative" : "", className)}
      aria-label={ariaLabel}
      title={title ?? ariaLabel}
    >
      <Icon className={cn(baseIconClass, iconClassName)} />
      <Badge count={badgeCount} max={badgeMax} />
    </Link>
  );
}

export function HeaderIconButton({
  onClick,
  Icon,
  ariaLabel,
  title,
  className,
  iconClassName,
  badgeCount,
  badgeMax,
}: BaseProps & { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(baseButtonClass, badgeCount ? "relative" : "", className)}
      aria-label={ariaLabel}
      title={title ?? ariaLabel}
    >
      <Icon className={cn(baseIconClass, iconClassName)} />
      <Badge count={badgeCount} max={badgeMax} />
    </button>
  );
}
