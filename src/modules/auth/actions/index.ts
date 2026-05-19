"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/core/auth/config";
import { loginSchema } from "../schemas";

export type LoginState = {
  error?: string;
} | undefined;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return { error: first ?? "Dados inválidos" };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "E-mail ou senha incorretos" };
        default:
          return { error: "Erro ao autenticar. Tente novamente." };
      }
    }
    throw error; // re-throw para o Next.js tratar redirects
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
