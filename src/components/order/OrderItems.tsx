import { OrderItem } from "@/types/api";
import { formatPrice } from "@/lib/utils";

interface OrderItemsProps {
  items: OrderItem[];
}

export function OrderItems({ items }: OrderItemsProps) {
  return (
    <div className="divide-y divide-slate-200">
      {items.map((item, idx) => (
        <div key={idx} className="py-3 sm:py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900 line-clamp-2">
                {item.productName}
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                {item.color && (
                  <span className="px-2 py-0.5 rounded-full border border-slate-200 text-slate-600 bg-white">
                    {item.color}
                  </span>
                )}
                <span>수량 {item.quantity}개</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs text-slate-500">상품금액</div>
              <div className="mt-0.5 text-sm font-extrabold text-slate-900">
                {formatPrice(item.price * item.quantity)}원
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

