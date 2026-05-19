import { EnvironmentType } from "@/generated/prisma";
import { Badge } from "@/components/ui/badge";
import {
  ENVIRONMENT_TYPE_LABELS,
  ENVIRONMENT_TYPE_VARIANTS,
} from "../utils/environment";

export function EnvironmentTypeBadge({ type }: { type: EnvironmentType }) {
  return (
    <Badge variant={ENVIRONMENT_TYPE_VARIANTS[type]}>
      {ENVIRONMENT_TYPE_LABELS[type]}
    </Badge>
  );
}
