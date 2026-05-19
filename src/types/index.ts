import type { UserRole } from "@/generated/prisma";

// ── Contracts ────────────────────────────────────────────────

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// ── Auth session extension ───────────────────────────────────

export type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
};

// ── Utility types ────────────────────────────────────────────

/** Extrai o tipo de data de um ActionResult bem-sucedido */
export type ActionData<T extends ActionResult> =
  T extends ActionResult<infer D> ? D : never;
