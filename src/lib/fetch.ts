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
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          // 로그아웃 처리 등
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
