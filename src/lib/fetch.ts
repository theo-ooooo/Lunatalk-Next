// redirect는 서버 사이드에서만 사용 가능하지만,
// useSuspenseQuery와 함께 사용 시 문제가 발생하므로 제거
// import { redirect } from "next/navigation";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://dev-api.lunatalk.co.kr";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

export async function fetchExtended<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, headers, ...rest } = options;

  // URL 파라미터 처리
  let url = `${BASE_URL}${path}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  // 헤더 설정 (토큰 포함)
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // 클라이언트 사이드에서만 로컬 스토리지 접근
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      (defaultHeaders as any)["Authorization"] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      headers: { ...defaultHeaders, ...headers },
      ...rest,
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // 클라이언트 사이드: 로컬 스토리지 삭제 및 에러 throw
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");

          // 무한 루프 방지를 위해 현재 페이지가 login이 아닐 때만 에러 throw
          // Suspense/ErrorBoundary에서 에러를 처리할 수 있도록 에러를 throw
          if (!window.location.pathname.includes("/login")) {
            const error = new Error("인증이 필요합니다.");
            (error as any).status = response.status;
            throw error;
          }
        }

        // 서버 사이드: redirect 대신 에러를 throw하여 클라이언트에서 처리하도록 함
        // useSuspenseQuery는 클라이언트 컴포넌트에서만 사용되므로 서버에서 실행되면 안 됨
        // 하지만 혹시 모를 경우를 대비해 에러만 throw
        const error = new Error("인증이 필요합니다.");
        (error as any).status = response.status;
        throw error;
      }

      // 에러 내용을 텍스트로 먼저 읽음 (JSON이 아닐 수도 있으므로)
      const responseBody = await response.json();
      let errorBody = responseBody;

      console.error(`[API Error] ${url} (${response.status})`, errorBody);
      throw new Error(
        errorBody.data.message || `API 요청 실패: ${response.status}`
      );
    }

    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();

    // 디버깅용 로그 (개발 모드에서만 보임)
    if (process.env.NODE_ENV === "development") {
      console.log(`[API] ${path}`, data);
    }

    // 만약 응답이 { code: ..., message: ..., data: ... } 형태라면 data를 반환
    if (data && typeof data === "object" && "data" in data) {
      return data.data as T;
    }

    return data as T;
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
}
