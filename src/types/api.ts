// 공통 응답 타입
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// 페이지네이션 관련 타입
export interface Pageable {
  page: number;
  size: number;
  sort?: string[];
}

export interface SortObject {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface PageableObject {
  offset: number;
  sort: SortObject;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
}

export interface PageResponse<T> {
  totalElements: number;
  totalPages: number;
  size: number;
  content: T[];
  number: number;
  sort: SortObject;
  numberOfElements: number;
  pageable: PageableObject;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 카테고리
export interface Category {
  categoryId: number;
  categoryName: string;
  status: "ACTIVE" | "DELETED";
  visibility: "VISIBLE" | "HIDDEN";
  productCount: number;
}

// 이미지
export interface Image {
  id: number;
  imageType: "PRODUCT_THUMBNAIL" | "PRODUCT_CONTENT";
  imageKey: string;
  imagePath?: string;
  imageUrl?: string; // FindImageDto 호환
  imageOrder?: number;
}

// 상품
export interface Product {
  productId: number;
  name: string; // ProductFindResponse에서는 name, FindProductDto에서는 productName
  productName?: string; // 호환성 위해 추가
  price: number;
  quantity: number;
  visibility: "VISIBLE" | "HIDDEN";
  colors: string[];
  images: Image[]; // FindImageDto
  category: Category;
  isLiked?: boolean; // 좋아요 여부
  likeCount?: number; // 좋아요 개수
  discountRate?: number; // (선택) 할인율 - 백엔드 제공 시만 표시
  reviewCount?: number; // (선택) 리뷰 수 - 백엔드 제공 시만 표시
}

export type ProductFindResponse = Product;

export type PageProductFindResponse = PageResponse<ProductFindResponse>;
export type PageOrderListResponse = PageResponse<Order>;

// 기획전
export interface Exhibition {
  exhibitionId: number;
  title: string;
  description: string;
  visibility: "VISIBLE" | "HIDDEN";
  startAt: string;
  endAt: string;
  products: ExhibitionProductDto[];
}

export interface ExhibitionProductDto {
  product: Product; // FindProductDto
  sortOrder: number;
}

// 장바구니
export interface CartItem {
  cartItemId: number;
  product: Product; // FindProductDto
  quantity: number;
}

// 주문
export interface OrderItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  totalPrice: number;
  color?: string;
  productImageUrl?: string;
}

export interface Delivery {
  deliveryId: number;
  receiverName: string;
  receiverPhone: string;
  addressLine1: string;
  addressLine2: string;
  zipcode: string;
  message: string;
  courierCompany:
    | "CJ_LOGISTICS"
    | "DHL"
    | "FEDEX"
    | "HANJIN"
    | "KOREA_POST"
    | "LOGEN"
    | "LOTTE"
    | "OTHER"
    | "UPS";
  trackingNumber: string;
  status: "READY" | "SHIPPED" | "DELIVERED" | "RETURNED" | "REDELIVERY";
}

export interface Order {
  orderId: number;
  orderNumber: string;
  status:
    | "ORDERED"
    | "PAYMENT_COMPLETED"
    | "PAYMENT_FAILED"
    | "CANCELLED"
    | "SHIPPED"
    | "DELIVERED";
  totalPrice: number;
  createdAt: string;
  nickname?: string;
  orderItems: OrderItem[];
  deliveries?: Delivery[];
  member?: Member;
}

// 회원
export interface Member {
  memberId: number;
  username: string;
  nickname: string;
  phone: string;
  email: string;
  profileImgUrl?: string;
  provider?: "KAKAO" | "LOCAL" | string;
  createdAt: string;
}

// 결제 (토스)
export interface PaymentConfirmRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface PaymentConfirmResponse {
  orderNumber: string;
  amount: number;
  paymentStatus: "READY" | "SUCCESS" | "FAILED" | "CANCELLED";
  orderStatus: string;
  paymentKey: string;
  approvedAt: string;
}

// 인증
export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// 요청 DTO들
export interface LoginRequest {
  username: string;
  password?: string; // 소셜 로그인 등 고려하여 optional 가능성 열어둠
}

export interface CreateMemberRequest {
  username: string;
  password: string;
  phone: string;
  email: string;
}

export interface CreateCartItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderCreateRequest {
  products: {
    productId: number;
    quantity: number;
    optionSnapshot?: {
      color: string;
    };
  }[];
}

export interface OrderCreateResponse {
  orderId: number;
  orderNumber: string;
  // 필요한 경우 추가 필드 정의
}

export interface OrderCreateDeliveryRequest {
  address1: string;
  address2: string;
  phoneNumber: string;
  zipCode: string;
  name: string;
  message?: string;
}

// 문의 관련
export interface InquiryCreateRequest {
  type: "PRODUCT" | "ORDER" | "GENERAL";
  title: string;
  content: string;
  referenceId?: number; // 상품 ID 또는 주문 ID
  orderNumber?: string; // 주문 번호 (주문 문의인 경우)
}

export interface InquiryUpdateRequest {
  title: string;
  content: string;
}

export interface InquiryReplyResponse {
  replyId: number;
  content: string;
  admin: Member;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryResponse {
  inquiryId: number;
  type: "PRODUCT" | "ORDER" | "GENERAL";
  title: string;
  content: string;
  status: "PENDING" | "ANSWERED" | "CLOSED";
  referenceId?: number; // 상품 ID, 주문 ID 등
  referenceName?: string; // 상품 이름, 주문 번호 등
  member: Member;
  reply?: InquiryReplyResponse;
  createdAt: string;
  updatedAt: string;
}

export type PageInquiryResponse = PageResponse<InquiryResponse>;
