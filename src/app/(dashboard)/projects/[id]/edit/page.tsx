import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { ProjectForm } from "@/modules/projects/components/project-form";
import { updateProjectAction } from "@/modules/projects/actions";
import { projectService } from "@/modules/projects/services/project.service";
import { clientService } from "@/modules/clients/services/client.service";
import { NotFoundError } from "@/core/errors";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  try {
    const project = await projectService.getById(id);
    return { title: `Editar — ${project.name}` };
  } catch {
    return { title: "Projeto não encontrado" };
  }
}

export default async function EditProjectPage({ params }: { params: Params }) {
  const { id } = await params;

  let project;
  try {
    project = await projectService.getById(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  const [clientsResult] = await Promise.all([
    clientService.list({ page: 1, limit: 200 }),
  ]);
  const clients = clientsResult.data.map((c) => ({ id: c.id, name: c.name }));

  const boundAction = updateProjectAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/projects/${id}`}>
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <PageHeader
        title={`Editar — ${project.name}`}
        description="Atualize os dados do projeto"
      />

      <ProjectForm
        action={boundAction}
        clients={clients}
        defaultValues={project}
        submitLabel="Salvar Alterações"
        redirectTo={`/projects/${id}`}
      />
    </div>
  );
}
