import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  FolderKanban,
  Calendar,
  Building2,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { ProjectStatusBadge } from "@/modules/projects/components/project-status-badge";
import { DeleteProjectButton } from "@/modules/projects/components/delete-project-button";
import { projectService } from "@/modules/projects/services/project.service";
import {
  PROJECT_TYPE_LABELS,
  formatDateDisplay,
} from "@/modules/projects/utils/project";
import { NotFoundError } from "@/core/errors";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  try {
    const project = await projectService.getById(id);
    return { title: project.name };
  } catch {
    return { title: "Projeto não encontrado" };
  }
}

export default async function ProjectDetailPage({ params }: { params: Params }) {
  const { id } = await params;

  let project;
  try {
    project = await projectService.getById(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/projects">
            <ChevronLeft className="h-4 w-4" />
            Projetos
          </Link>
        </Button>
      </div>

      <PageHeader title={project.name} description="Detalhes do projeto">
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/projects/${id}/edit`}>Editar</Link>
          </Button>
          <DeleteProjectButton
            id={project.id}
            name={project.name}
            redirectAfter="/projects"
          />
        </div>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard icon={FolderKanban} label="Status">
          <ProjectStatusBadge status={project.status} />
        </InfoCard>

        <InfoCard icon={Building2} label="Cliente">
          <Link
            href={`/clients/${project.client.id}`}
            className="hover:underline"
          >
            {project.client.name}
          </Link>
        </InfoCard>

        <InfoCard icon={Tag} label="Tipo">
          {PROJECT_TYPE_LABELS[project.type]}
        </InfoCard>

        {project.startDate && (
          <InfoCard icon={Calendar} label="Início">
            {formatDateDisplay(project.startDate)}
          </InfoCard>
        )}

        {project.endDate && (
          <InfoCard icon={Calendar} label="Término previsto">
            {formatDateDisplay(project.endDate)}
          </InfoCard>
        )}
      </div>

      {project.description && (
        <div className="rounded-md border p-4 space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Descrição</p>
          <p className="text-sm whitespace-pre-wrap">{project.description}</p>
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
