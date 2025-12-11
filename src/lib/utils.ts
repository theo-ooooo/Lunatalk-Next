import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ko-KR").format(price);
};

export const getImageUrl = (path?: string) => {
  console.log("path", path);
  if (!path) return "https://placehold.co/400x400?text=No+Image";

  if (path.startsWith("http")) return path;

  // 앞의 슬래시 제거
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // CDN 도메인 연결
  return `https://media-v2.lunatalk.co.kr/${cleanPath}`;
};
