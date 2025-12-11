import React from "react";
import { cn } from "@/lib/utils";

interface SummaryRowProps {
  label: string;
  value: React.ReactNode;
  className?: string;
  isTotal?: boolean;
}

export function SummaryRow({
  label,
  value,
  className,
  isTotal = false,
}: SummaryRowProps) {
  return (
    <div
      className={cn(
        "flex justify-between items-center",
        isTotal ? "text-slate-900 font-bold" : "text-slate-600",
        className
      )}
    >
      <span className={cn(isTotal && "text-lg")}>{label}</span>
      <span className={cn(isTotal && "text-xl")}>{value}</span>
    </div>
  );
}

