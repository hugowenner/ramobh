import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  Server,
  Building2,
  FolderKanban,
  Globe,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { EnvironmentTypeBadge } from "@/modules/environments/components/environment-type-badge";
import { DeleteEnvironmentButton } from "@/modules/environments/components/delete-environment-button";
import { environmentService } from "@/modules/environments/services/environment.service";
import { NotFoundError } from "@/core/errors";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  try {
    const env = await environmentService.getById(id);
    return { title: env.name };
  } catch {
    return { title: "Ambiente não encontrado" };
  }
}

export default async function EnvironmentDetailPage({ params }: { params: Params }) {
  const { id } = await params;

  let env;
  try {
    env = await environmentService.getById(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/environments">
            <ChevronLeft className="h-4 w-4" />
            Ambientes
          </Link>
        </Button>
      </div>

      <PageHeader title={env.name} description="Detalhes do ambiente">
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/environments/${id}/edit`}>Editar</Link>
          </Button>
          <DeleteEnvironmentButton
            id={env.id}
            name={env.name}
            redirectAfter="/environments"
          />
        </div>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard icon={Server} label="Tipo">
          <EnvironmentTypeBadge type={env.type} />
        </InfoCard>

        <InfoCard icon={Building2} label="Cliente">
          <Link
            href={`/clients/${env.client.id}`}
            className="hover:underline"
          >
            {env.client.name}
          </Link>
        </InfoCard>

        {env.project && (
          <InfoCard icon={FolderKanban} label="Projeto">
            <Link
              href={`/projects/${env.project.id}`}
              className="hover:underline"
            >
              {env.project.name}
            </Link>
          </InfoCard>
        )}

        {env.version && (
          <InfoCard icon={Tag} label="Versão">
            {env.version}
          </InfoCard>
        )}

        {env.url && (
          <InfoCard icon={Globe} label="URL">
            <a
              href={env.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline break-all"
            >
              {env.url}
            </a>
          </InfoCard>
        )}
      </div>

      {env.description && (
        <div className="rounded-md border p-4 space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Descrição</p>
          <p className="text-sm whitespace-pre-wrap">{env.description}</p>
        </div>
      )}

      {env.notes && (
        <div className="rounded-md border p-4 space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Notas técnicas</p>
          <p className="text-sm whitespace-pre-wrap font-mono">{env.notes}</p>
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
