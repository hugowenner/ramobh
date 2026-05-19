import { ClientStatus } from "@/generated/prisma";
import { Badge } from "@/components/ui/badge";

const STATUS_MAP: Record<ClientStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  [ClientStatus.ACTIVE]: { label: "Ativo", variant: "default" },
  [ClientStatus.INACTIVE]: { label: "Inativo", variant: "secondary" },
  [ClientStatus.PROSPECT]: { label: "Prospecto", variant: "outline" },
};

export function ClientStatusBadge({ status }: { status: ClientStatus }) {
  const { label, variant } = STATUS_MAP[status];
  return <Badge variant={variant}>{label}</Badge>;
}
