import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { EnvironmentForm } from "@/modules/environments/components/environment-form";
import { updateEnvironmentAction } from "@/modules/environments/actions";
import { environmentService } from "@/modules/environments/services/environment.service";
import { clientService } from "@/modules/clients/services/client.service";
import { getProjectOptionsByClient } from "@/modules/projects/actions";
import { NotFoundError } from "@/core/errors";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  try {
    const env = await environmentService.getById(id);
    return { title: `Editar — ${env.name}` };
  } catch {
    return { title: "Ambiente não encontrado" };
  }
}

export default async function EditEnvironmentPage({ params }: { params: Params }) {
  const { id } = await params;

  let env;
  try {
    env = await environmentService.getById(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  const [clientsResult, initialProjects] = await Promise.all([
    clientService.list({ page: 1, limit: 200 }),
    env.clientId ? getProjectOptionsByClient(env.clientId) : Promise.resolve([]),
  ]);
  const clients = clientsResult.data.map((c) => ({ id: c.id, name: c.name }));

  const boundAction = updateEnvironmentAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/environments/${id}`}>
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <PageHeader
        title={`Editar — ${env.name}`}
        description="Atualize os dados do ambiente"
      />

      <EnvironmentForm
        action={boundAction}
        clients={clients}
        initialProjects={initialProjects}
        defaultValues={env}
        submitLabel="Salvar Alterações"
        redirectTo={`/environments/${id}`}
      />
    </div>
  );
}
