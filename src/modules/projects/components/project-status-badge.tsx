import { ProjectStatus } from "@/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { PROJECT_STATUS_LABELS } from "../utils/project";

type Variant = "default" | "secondary" | "destructive" | "outline";

const STATUS_VARIANT: Record<ProjectStatus, Variant> = {
  [ProjectStatus.PLANNING]: "outline",
  [ProjectStatus.IN_PROGRESS]: "default",
  [ProjectStatus.ON_HOLD]: "secondary",
  [ProjectStatus.COMPLETED]: "secondary",
  [ProjectStatus.CANCELLED]: "destructive",
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Badge variant={STATUS_VARIANT[status]}>
      {PROJECT_STATUS_LABELS[status]}
    </Badge>
  );
}
