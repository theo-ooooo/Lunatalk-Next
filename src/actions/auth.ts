"use server";

import { authApi } from "@/services/api";
import {
  LoginRequest,
  CreateMemberRequest,
  AuthTokenResponse,
} from "@/types/api";

export async function loginAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean; accessToken?: string }> {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
      return { error: "아이디와 비밀번호를 입력해주세요." };
    }

    const response = await authApi.login({
      username,
      password,
    } as LoginRequest);

    if (response.accessToken) {
      return { success: true, accessToken: response.accessToken };
    }

    return { error: "로그인에 실패했습니다." };
  } catch (error: any) {
    return {
      error:
        error.message ||
        "로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.",
    };
  }
}

export async function registerAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean; accessToken?: string }> {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;

    if (!username || !password || !email || !phone) {
      return { error: "모든 필드를 입력해주세요." };
    }

    if (password !== confirmPassword) {
      return { error: "비밀번호가 일치하지 않습니다." };
    }

    const response = await authApi.register({
      username,
      password,
      email,
      phone,
    } as CreateMemberRequest);

    if (response.accessToken) {
      return { success: true, accessToken: response.accessToken };
    }

    return { error: "회원가입에 실패했습니다." };
  } catch (error: any) {
    return {
      error:
        error.message || "회원가입에 실패했습니다. 입력 정보를 확인해주세요.",
    };
  }
}
