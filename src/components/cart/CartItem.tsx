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
    <div className="flex gap-4 p-4 border rounded-lg bg-white">
      <input
        type="checkbox"
        className="w-5 h-5 mt-2 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
        checked={isSelected}
        onChange={(e) => onSelect(e.target.checked)}
      />
      <div className="w-24 h-24 bg-slate-100 rounded-md overflow-hidden flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getImageUrl(item.product.images?.[0]?.imagePath)}
          alt={item.product.name || item.product.productName || "상품 이미지"}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-medium line-clamp-2">
            {item.product.name || item.product.productName}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {formatPrice(item.product.price)}원
          </p>

          {/* 상품 옵션 (Colors) 표시 */}
          {item.product.colors && item.product.colors.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">옵션:</span>
              <div className="flex flex-wrap gap-1">
                {item.product.colors.map((color, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded-md border border-slate-100"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>수량: {item.quantity}개</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-slate-400 hover:text-red-500 hover:bg-red-50"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

