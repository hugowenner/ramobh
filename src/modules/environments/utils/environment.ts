import { EnvironmentType } from "@/generated/prisma";

export const ENVIRONMENT_TYPE_LABELS: Record<EnvironmentType, string> = {
  [EnvironmentType.PRODUCTION]: "Produção",
  [EnvironmentType.HOMOLOGATION]: "Homologação",
  [EnvironmentType.DEVELOPMENT]: "Desenvolvimento",
  [EnvironmentType.SANDBOX]: "Sandbox",
};

type Variant = "default" | "secondary" | "outline" | "destructive";

export const ENVIRONMENT_TYPE_VARIANTS: Record<EnvironmentType, Variant> = {
  [EnvironmentType.PRODUCTION]: "default",
  [EnvironmentType.HOMOLOGATION]: "secondary",
  [EnvironmentType.DEVELOPMENT]: "outline",
  [EnvironmentType.SANDBOX]: "outline",
};
