import { Button } from "@/components/ui/Button";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { CartItem as CartItemType } from "@/types/api";
import { Trash2 } from "lucide-react";
import React from "react";

interface CartItemProps {
  item: CartItemType;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onDelete: () => void;
}

export function CartItem({
  item,
  isSelected,
  onSelect,
  onDelete,
}: CartItemProps) {
  return (
    <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
      <input
        type="checkbox"
        className="w-4 h-4 sm:w-5 sm:h-5 mt-1 sm:mt-2 rounded border-slate-300 text-slate-900 focus:ring-slate-900 flex-shrink-0"
        checked={isSelected}
        onChange={(e) => onSelect(e.target.checked)}
      />
      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getImageUrl(item.product.images?.[0]?.imagePath)}
          alt={item.product.name || item.product.productName || "상품 이미지"}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-sm sm:text-base lg:text-sm text-slate-900 line-clamp-2 mb-1">
            {item.product.name || item.product.productName}
          </h3>

          {/* 상품 옵션 (Colors) 표시 */}
          {item.product.colors && item.product.colors.length > 0 && (
            <div className="mb-2 flex items-center gap-2 flex-wrap">
              {item.product.colors.map((color, idx) => (
                <span
                  key={idx}
                  className="text-xs lg:text-[10px] px-1.5 sm:px-2 lg:px-1.5 py-0.5 sm:py-1 lg:py-0.5 bg-white text-slate-600 rounded border border-slate-200"
                >
                  {color}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 text-xs sm:text-sm lg:text-xs text-slate-500 mb-2">
            <span>수량: {item.quantity}개</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <span className="text-xs lg:text-[10px] text-slate-500">상품금액</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base sm:text-lg lg:text-base text-slate-900">
              {formatPrice(item.product.price * item.quantity)}원
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


