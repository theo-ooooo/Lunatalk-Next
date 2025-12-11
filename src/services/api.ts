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
  OrderCreateResponse,
  PageProductFindResponse,
  ProductFindResponse,
  CartItem,
  CreateCartItemRequest,
  PaymentConfirmRequest,
  PaymentConfirmResponse,
  PageOrderListResponse,
  OrderCreateDeliveryRequest,
} from "@/types/api";

// 상품 관련
export const productApi = {
  getProducts: async (params: {
    page: number;
    size: number;
    sort?: string[];
    productName?: string;
  }) => {
    // fetchExtended가 T 타입을 반환하므로 바로 return
    const data = await fetchExtended<PageProductFindResponse>("/products", {
      params: { ...params } as any,
      cache: "no-store", // 상품 목록/검색은 실시간성이 중요하므로 캐시 끔
    });
    return data;
  },
  getProduct: async (id: number) => {
    return fetchExtended<ProductFindResponse>(`/products/${id}`, {
      cache: "no-store", // 상세 페이지도 재고 등 실시간 정보 필요
    });
  },
};

// 카테고리 관련
export const categoryApi = {
  getCategories: async () => {
    return fetchExtended<Category[]>("/categories", {
      next: { revalidate: 3600 }, // 카테고리는 자주 안 바뀌니 1시간 캐시
    });
  },
  getCategoryProducts: async (id: number) => {
    return fetchExtended<any>(`/categories/${id}/products`, {
      cache: "no-store",
    });
  },
};

// 기획전 관련
export const exhibitionApi = {
  getExhibitions: async () => {
    return fetchExtended<Exhibition[]>("/exhibitions", {
      cache: "no-store",
    });
  },
  getExhibition: async (id: number) => {
    return fetchExtended<Exhibition>(`/exhibitions/${id}`, {
      cache: "no-store",
    });
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
    return fetchExtended<OrderCreateResponse>("/orders", {
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
    return fetchExtended<Order>(`/orders/${orderNumber}`, {
      cache: "no-store", // 주문 상세 정보는 실시간 확인 필요
    });
  },
  confirmPayment: async (data: PaymentConfirmRequest) => {
    return fetchExtended<PaymentConfirmResponse>("/payments/confirm", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  // 배송지 등록
  registerDelivery: async (
    orderNumber: string,
    data: OrderCreateDeliveryRequest
  ) => {
    return fetchExtended(`/orders/${orderNumber}/delivery`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};
