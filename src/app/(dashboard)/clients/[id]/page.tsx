import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Building2, MapPin, Hash, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { ClientStatusBadge } from "@/modules/clients/components/client-status-badge";
import { DeleteClientButton } from "@/modules/clients/components/delete-client-button";
import { clientService } from "@/modules/clients/services/client.service";
import { formatCnpj } from "@/modules/clients/utils/cnpj";
import { NotFoundError } from "@/core/errors";

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const client = await clientService.getById(id);
    return { title: client.name };
  } catch {
    return { title: "Cliente não encontrado" };
  }
}

export default async function ClientDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  let client;
  try {
    client = await clientService.getById(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  const location = [client.city, client.state, client.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/clients">
            <ChevronLeft className="h-4 w-4" />
            Clientes
          </Link>
        </Button>
      </div>

      <PageHeader title={client.name} description="Detalhes do cliente">
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/clients/${id}/edit`}>Editar</Link>
          </Button>
          <DeleteClientButton
            id={client.id}
            name={client.name}
            redirectAfter="/clients"
          />
        </div>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard icon={Building2} label="Status">
          <ClientStatusBadge status={client.status} />
        </InfoCard>

        {client.cnpj && (
          <InfoCard icon={Hash} label="CNPJ">
            {formatCnpj(client.cnpj)}
          </InfoCard>
        )}

        {client.segment && (
          <InfoCard icon={Tag} label="Segmento">
            {client.segment}
          </InfoCard>
        )}

        {location && (
          <InfoCard icon={MapPin} label="Localização">
            {location}
          </InfoCard>
        )}
      </div>

      {client.notes && (
        <div className="rounded-md border p-4 space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            Observações
          </p>
          <p className="text-sm whitespace-pre-wrap">{client.notes}</p>
        </div>
      )}
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border p-4 space-y-1">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
      </div>
      <div className="text-sm font-medium">{children}</div>
    </div>
  );
}
