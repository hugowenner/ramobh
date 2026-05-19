import { ProjectStatus, ProjectType } from "@/generated/prisma";

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.PLANNING]: "Planejamento",
  [ProjectStatus.IN_PROGRESS]: "Em andamento",
  [ProjectStatus.ON_HOLD]: "Pausado",
  [ProjectStatus.COMPLETED]: "Concluído",
  [ProjectStatus.CANCELLED]: "Cancelado",
};

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  [ProjectType.IMPLEMENTATION]: "Implantação",
  [ProjectType.MIGRATION]: "Migração",
  [ProjectType.SUPPORT]: "Suporte",
  [ProjectType.UPGRADE]: "Upgrade",
  [ProjectType.CONSULTING]: "Consultoria",
  [ProjectType.OTHER]: "Outro",
};

// Formata Date → "YYYY-MM-DD" para <input type="date">
export function formatDateForInput(date?: Date | null): string {
  if (!date) return "";
  return date.toISOString().split("T")[0];
}

// Formata Date → "DD/MM/YYYY" para exibição
export function formatDateDisplay(date?: Date | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
}
