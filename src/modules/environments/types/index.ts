import type { Environment, EnvironmentType } from "@/generated/prisma";

export type EnvironmentRecord = Environment;

// Projeção de listagem — inclui client e project para exibição na tabela sem N+1
export type EnvironmentSummary = Pick<
  Environment,
  | "id"
  | "name"
  | "type"
  | "description"
  | "clientId"
  | "projectId"
  | "url"
  | "version"
  | "createdAt"
> & {
  client: { id: string; name: string };
  project: { id: string; name: string } | null;
};

// Tipo completo retornado por getById
export type EnvironmentWithRelations = Environment & {
  client: { id: string; name: string };
  project: { id: string; name: string } | null;
};

export type EnvironmentFilters = {
  search?: string;
  type?: EnvironmentType;
  clientId?: string;
  projectId?: string;
};

export type { EnvironmentType };
