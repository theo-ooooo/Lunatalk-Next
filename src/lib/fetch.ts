// redirect는 서버 사이드에서만 사용 가능하지만,
// useSuspenseQuery와 함께 사용 시 문제가 발생하므로 제거
// import { redirect } from "next/navigation";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://dev-api.lunatalk.co.kr";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
  cookies?: string; // 서버 사이드에서 쿠키를 전달하기 위한 옵션
}

export async function fetchExtended<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, headers, cookies, ...rest } = options;

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
      (defaultHeaders as Record<string, string>)[
        "Authorization"
      ] = `Bearer ${token}`;
    }
  }

  // 서버 사이드에서 쿠키를 헤더에 포함
  if (typeof window === "undefined") {
    // 서버 사이드에서는 쿠키를 자동으로 읽어서 헤더에 포함
    try {
      // Next.js의 cookies() 함수를 동적으로 import
      const { cookies: getCookies } = await import("next/headers");
      const cookieStore = await getCookies();

      // accessToken 쿠키를 찾아서 Authorization 헤더에 포함
      const accessToken = cookieStore.get("accessToken");
      if (accessToken) {
        (defaultHeaders as Record<string, string>)[
          "Authorization"
        ] = `Bearer ${accessToken.value}`;
        if (process.env.NODE_ENV === "development") {
          console.log(
            `[Server] Authorization 헤더 포함: Bearer ${accessToken.value.substring(
              0,
              20
            )}...`
          );
        }
      }

      // 모든 쿠키를 Cookie 헤더에도 포함 (백엔드가 Cookie 헤더를 사용하는 경우)
      const cookieString = cookieStore
        .getAll()
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");

      if (cookieString) {
        (defaultHeaders as Record<string, string>)["Cookie"] = cookieString;
      } else {
        if (process.env.NODE_ENV === "development") {
          console.warn(`[Server] 쿠키가 없습니다: ${url}`);
        }
      }
    } catch (error) {
      // cookies()를 사용할 수 없는 경우 (클라이언트 사이드 등)
      // 명시적으로 전달된 쿠키가 있으면 사용
      if (cookies) {
        (defaultHeaders as Record<string, string>)["Cookie"] = cookies;
      } else {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `[Server] cookies() 사용 불가 및 명시적 쿠키 없음: ${url}`,
            error
          );
        }
      }
    }
  }

  try {
    const response = await fetch(url, {
      headers: { ...defaultHeaders, ...headers },
      credentials: "include", // 쿠키를 받기 위해 필요
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
            const error = new Error("인증이 필요합니다.") as Error & {
              status?: number;
            };
            error.status = response.status;
            throw error;
          }
        }

        // 서버 사이드: 에러를 throw하지 않고 조용히 실패
        // 서버 컴포넌트에서 인증이 필요한 API를 호출하는 것은 권장되지 않음
        // 클라이언트 컴포넌트에서만 호출하도록 하거나, 에러를 조용히 처리
        if (typeof window === "undefined") {
          // 서버 사이드에서는 쿠키가 제대로 전달되지 않을 수 있으므로
          // 에러를 throw하지 않고 클라이언트에서 재시도하도록 함
          // useSuspenseQuery는 클라이언트에서만 실행되므로, 서버 사이드에서는
          // 에러를 throw하지 않고 기본값을 반환하거나 클라이언트로 위임
          console.warn(
            `[Server] 인증이 필요한 API 호출이 서버 사이드에서 실패했습니다: ${url}. 클라이언트에서 재시도됩니다.`
          );
          // 서버 사이드에서는 에러를 throw하지 않고, 클라이언트에서 처리하도록 함
          // 하지만 useSuspenseQuery는 에러를 기대하므로 에러를 throw해야 함
          // 대신 쿠키를 제대로 읽어서 전달하도록 시도
          const error = new Error("인증이 필요합니다.") as Error & {
            status?: number;
          };
          error.status = response.status;
          throw error;
        }
      }

      // 에러 내용을 텍스트로 먼저 읽음 (JSON이 아닐 수도 있으므로)
      const responseBody = await response.json();
      const errorBody = responseBody;

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
