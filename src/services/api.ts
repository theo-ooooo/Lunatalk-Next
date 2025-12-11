import { fetchExtended } from "@/lib/fetch";
import {
  AuthTokenResponse,
  Category,
  CreateMemberRequest,
  Exhibition,
  LoginRequest,
  Member,
  Order,
  OrderCreateRequest,
  PageProductFindResponse,
  ProductFindResponse,
  CartItem,
  CreateCartItemRequest,
  PaymentConfirmRequest,
  PaymentConfirmResponse,
  PageOrderListResponse,
} from "@/types/api";

// 상품 관련
export const productApi = {
  getProducts: async (params: {
    page: number;
    size: number;
    sort?: string[];
  }) => {
    // fetchExtended가 T 타입을 반환하므로 바로 return
    const data = await fetchExtended<PageProductFindResponse>("/products", {
      params: { ...params } as any,
    });
    return data;
  },
  getProduct: async (id: number) => {
    return fetchExtended<ProductFindResponse>(`/products/${id}`);
  },
};

// 카테고리 관련
export const categoryApi = {
  getCategories: async () => {
    return fetchExtended<Category[]>("/categories");
  },
  getCategoryProducts: async (id: number) => {
    return fetchExtended<any>(`/categories/${id}/products`);
  },
};

// 기획전 관련
export const exhibitionApi = {
  getExhibitions: async () => {
    return fetchExtended<Exhibition[]>("/exhibitions");
  },
  getExhibition: async (id: number) => {
    return fetchExtended<Exhibition>(`/exhibitions/${id}`);
  },
};

// 회원 관련
export const authApi = {
  login: async (data: LoginRequest) => {
    return fetchExtended<AuthTokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  register: async (data: CreateMemberRequest) => {
    return fetchExtended<AuthTokenResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getMe: async () => {
    return fetchExtended<Member>("/members/me");
  },
};

// 장바구니 관련
export const cartApi = {
  getCartItems: async () => {
    return fetchExtended<CartItem[]>("/cart-items", { cache: "no-store" }); // 장바구니는 실시간성이 중요하므로 no-store
  },
  addToCart: async (data: CreateCartItemRequest) => {
    return fetchExtended("/cart-items", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  deleteCartItem: async (id: number) => {
    return fetchExtended(`/cart-items/${id}`, {
      method: "DELETE",
    });
  },
};

// 주문 관련
export const orderApi = {
  createOrder: async (data: OrderCreateRequest) => {
    return fetchExtended("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getOrders: async (params: { page: number; size: number }) => {
    return fetchExtended<PageOrderListResponse>("/orders", {
      params: { ...params } as any,
    });
  },
  getOrder: async (orderNumber: string) => {
    return fetchExtended<Order>(`/orders/${orderNumber}`);
  },
  confirmPayment: async (data: PaymentConfirmRequest) => {
    return fetchExtended<PaymentConfirmResponse>("/payments/confirm", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
