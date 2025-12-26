import React from "react";
import { cn } from "@/lib/utils";

interface InfoRowProps {
  label: string;
  value?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function InfoRow({ label, value, className, children }: InfoRowProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-1 sm:gap-4 lg:gap-3", className)}>
      <span className="w-full sm:w-20 lg:w-18 text-xs sm:text-sm lg:text-xs text-slate-500 font-medium shrink-0">
        {label}
      </span>
      <div className="text-xs sm:text-sm md:text-base lg:text-sm text-slate-900 font-medium flex-1">
        {value || children}
      </div>
    </div>
  );
}

