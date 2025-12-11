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
    <div className={cn("flex gap-4", className)}>
      <span className="w-20 text-slate-500 font-medium shrink-0">{label}</span>
      <div className="text-slate-900 font-medium flex-1">
        {value || children}
      </div>
    </div>
  );
}

