import { create } from 'zustand';
import { CartItem, Product } from '@/types/api';

interface OrderItem {
  productId: number;
  quantity: number;
  productName: string;
  price: number;
  imageUrl?: string;
}

interface OrderState {
  orderItems: OrderItem[];
  setOrderItems: (items: OrderItem[]) => void;
  clearOrder: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orderItems: [],
  setOrderItems: (items) => set({ orderItems: items }),
  clearOrder: () => set({ orderItems: [] }),
}));


