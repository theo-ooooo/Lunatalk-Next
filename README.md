# LUNATALK

루나톡 쇼핑몰 웹 애플리케이션입니다.

## 기술 스택

- **Next.js 16** - App Router 사용
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **TanStack Query** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리
- **Toss Payments** - 결제 연동

## 시작하기

### 환경 변수 설정

`.env` 파일을 생성하고 다음 변수를 설정하세요:

```
NEXT_PUBLIC_API_URL=https://dev-api.lunatalk.co.kr
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

개발 서버는 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

## 프로젝트 구조

```
src/
├── app/              # Next.js App Router 페이지
├── components/       # 재사용 가능한 컴포넌트
├── hooks/            # 커스텀 훅
├── services/         # API 서비스
├── store/            # Zustand 스토어
├── lib/              # 유틸리티 함수
├── types/            # TypeScript 타입 정의
└── actions/          # Server Actions
```

## 주요 기능

- 상품 조회 및 검색
- 장바구니
- 주문 관리 및 배송 조회
- 마이페이지 (주문 내역, 프로필 수정)
- 로그인/회원가입
- 결제 (토스페이먼츠)

## 개발 가이드

### 컴포넌트 작성

- 서버 컴포넌트를 기본으로 사용
- 클라이언트 컴포넌트는 `"use client"` 지시어 사용
- 재사용 가능한 컴포넌트는 `components/` 디렉토리에 작성

### 데이터 페칭

- 서버 컴포넌트: 직접 `fetch` 또는 API 함수 호출
- 클라이언트 컴포넌트: `useSuspenseQuery` 또는 `useQuery` 사용
- 에러 처리: `QueryErrorBoundary`로 중앙화

### 상태 관리

- 서버 상태: TanStack Query
- 클라이언트 상태: Zustand
- 폼 상태: Server Actions + `useActionState`

## 빌드

프로덕션 빌드 시 인증이 필요한 페이지는 동적 렌더링으로 처리됩니다:

- `/mypage/edit`
- `/orders/[orderNumber]`
- `/orders/update/[orderNumber]`

## 라이센스

Private
