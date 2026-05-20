import type { Metadata } from "next";
import { LoginForm } from "@/modules/auth/components/login-form";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      {/* Brand */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-ramo-primary text-white">
          <span className="text-lg font-bold">R</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-ramo-text">
          Portal Técnico
        </h1>
        <p className="mt-1 text-sm text-ramo-muted">
          Ramo Consultoria SAP
        </p>
      </div>

      {/* Card */}
      <div className="rounded-xl border border-ramo-border bg-ramo-surface p-6 shadow-sm">
        <LoginForm />
      </div>

      <p className="mt-6 text-center text-xs text-ramo-muted">
        Acesso restrito a colaboradores da Ramo
      </p>
    </div>
  );
}
