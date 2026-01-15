import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loading({ message, fullScreen = true }: LoadingProps) {
  const containerClass = fullScreen
    ? "min-h-screen bg-white flex items-center justify-center"
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        {message && (
          <p className="text-sm text-slate-500 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}

