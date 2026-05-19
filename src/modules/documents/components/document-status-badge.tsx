import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DOCUMENT_STATUS_LABELS } from "../constants";
import type { DocumentStatus } from "@/generated/prisma";

type Props = {
  status: DocumentStatus;
  className?: string;
};

const STATUS_CLASS: Record<DocumentStatus, string> = {
  DRAFT: "",
  REVIEW: "bg-blue-500/15 text-blue-700 border-blue-200 dark:text-blue-400",
  APPROVED: "bg-green-500/15 text-green-700 border-green-200 dark:text-green-400",
  ARCHIVED: "",
};

const STATUS_VARIANT: Record<
  DocumentStatus,
  "secondary" | "outline" | "default" | "destructive"
> = {
  DRAFT: "secondary",
  REVIEW: "outline",
  APPROVED: "outline",
  ARCHIVED: "outline",
};

export function DocumentStatusBadge({ status, className }: Props) {
  return (
    <Badge
      variant={STATUS_VARIANT[status]}
      className={cn(STATUS_CLASS[status], className)}
    >
      {DOCUMENT_STATUS_LABELS[status]}
    </Badge>
  );
}
