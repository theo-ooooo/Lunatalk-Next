import { redirect } from "next/navigation";

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
        if (typeof window !== "undefined") {
          // 클라이언트 사이드: 로컬 스토리지 삭제 및 리로드 (또는 로그인 페이지로 이동)
          // Zustand 스토어 외부에서 상태 변경은 까다로울 수 있으므로 직접 스토리지 제어
          localStorage.removeItem("accessToken");

          // useAuthStore의 상태도 초기화해주면 좋지만, 여기서는 fetch 함수 내부이므로
          // 간단히 로컬스토리지 정리 후 새로고침하여 상태 초기화를 유도합니다.
          // 무한 루프 방지를 위해 현재 페이지가 login이 아닐 때만 리로드 또는 이동
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
        } else {
          // 서버 사이드: redirect 함수 사용 가능 (Server Components)
          // 단, 렌더링 도중이 아닌 데이터 페칭 중 redirect는 에러로 취급될 수 있으나
          // Next.js에서 내부적으로 throw Error('NEXT_REDIRECT')를 사용하므로 동작함.
          redirect("/login");
        }
      }

      // 에러 내용을 텍스트로 먼저 읽음 (JSON이 아닐 수도 있으므로)
      const errorText = await response.text().catch(() => "");
      let errorBody;
      try {
        errorBody = JSON.parse(errorText);
      } catch {
        errorBody = { message: errorText || `HTTP Error ${response.status}` };
      }

      console.error(`[API Error] ${url} (${response.status})`, errorBody);
      throw new Error(errorBody.message || `API 요청 실패: ${response.status}`);
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
