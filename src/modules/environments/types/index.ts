import type { Environment, EnvironmentType } from "@/generated/prisma";

export type EnvironmentRecord = Environment;

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
>;

export type EnvironmentFilters = {
  search?: string;
  type?: EnvironmentType;
  clientId?: string;
  projectId?: string;
};

export type { EnvironmentType };
