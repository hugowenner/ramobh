import type { Project, ProjectStatus, ProjectType } from "@/generated/prisma";

export type ProjectRecord = Project;

// Projeção de listagem — inclui client para exibir na tabela
export type ProjectSummary = Pick<
  Project,
  | "id"
  | "name"
  | "description"
  | "type"
  | "status"
  | "startDate"
  | "endDate"
  | "clientId"
  | "createdAt"
> & {
  client: { id: string; name: string };
};

// Tipo retornado pelo getById — registro completo + client
export type ProjectWithClient = Project & {
  client: { id: string; name: string };
};

export type ProjectFilters = {
  search?: string;
  status?: ProjectStatus;
  type?: ProjectType;
  clientId?: string;
};

export type { ProjectStatus, ProjectType };
