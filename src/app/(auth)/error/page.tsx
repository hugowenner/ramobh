import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Erro de Autenticação",
};

export default function AuthErrorPage() {
  return (
    <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-8 shadow-sm">
      <h1 className="text-xl font-semibold text-red-600">Erro de autenticação</h1>
      <p className="mt-2 text-sm text-ramo-muted">
        Ocorreu um erro ao tentar autenticar. Tente novamente.
      </p>
    </div>
  );
}
