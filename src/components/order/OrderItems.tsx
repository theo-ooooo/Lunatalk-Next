import { OrderItem } from "@/types/api";
import { formatPrice } from "@/lib/utils";

interface OrderItemsProps {
  items: OrderItem[];
}

export function OrderItems({ items }: OrderItemsProps) {
  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-3">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex gap-3 sm:gap-4 lg:gap-3 p-3 sm:p-4 lg:p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-20 lg:h-20 bg-white rounded-lg flex-shrink-0 overflow-hidden border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://placehold.co/200x200/f1f5f9/94a3b8?text=Product"
              alt={item.productName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="mb-1 sm:mb-2 lg:mb-1">
              <span className="text-[10px] sm:text-xs lg:text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                LUNATALK
              </span>
            </div>
            <h3 className="font-bold text-slate-900 mb-1.5 sm:mb-2 lg:mb-1.5 text-sm sm:text-base lg:text-sm line-clamp-2">
              {item.productName}
            </h3>
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-2 text-xs sm:text-sm lg:text-xs text-slate-600 mb-2 sm:mb-3 lg:mb-2 flex-wrap">
              {item.color && (
                <span className="px-1.5 sm:px-2 lg:px-1.5 py-0.5 sm:py-1 lg:py-0.5 bg-white rounded border border-slate-200 text-xs lg:text-[10px]">
                  {item.color}
                </span>
              )}
              <span className="text-slate-500">수량: {item.quantity}개</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-[10px] sm:text-xs lg:text-[10px] text-slate-500">
                상품금액
              </span>
              <span className="font-bold text-base sm:text-lg lg:text-base text-slate-900">
                {formatPrice(item.price * item.quantity)}원
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

