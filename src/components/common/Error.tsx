import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AlertCircle } from "lucide-react";

interface ErrorProps {
  message?: string;
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
  fullScreen?: boolean;
}

export function Error({
  message = "정보를 불러올 수 없습니다.",
  actionLabel = "홈으로 돌아가기",
  actionHref = "/",
  onActionClick,
  fullScreen = true,
}: ErrorProps) {
  const containerClass = fullScreen
    ? "min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4"
    : "flex flex-col items-center justify-center gap-4 py-12";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-4">
        <AlertCircle className="w-12 h-12 text-slate-400" />
        <p className="text-slate-500 font-medium">{message}</p>
        {actionHref && !onActionClick && (
          <Link href={actionHref}>
            <Button>{actionLabel}</Button>
          </Link>
        )}
        {onActionClick && (
          <Button onClick={onActionClick}>{actionLabel}</Button>
        )}
      </div>
    </div>
  );
}

