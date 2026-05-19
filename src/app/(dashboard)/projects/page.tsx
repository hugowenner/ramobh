import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { projectService } from "@/modules/projects/services/project.service";
import { clientService } from "@/modules/clients/services/client.service";
import { ProjectTable } from "@/modules/projects/components/project-table";
import { ProjectFilters } from "@/modules/projects/components/project-filters";
import type { ProjectStatus, ProjectType } from "@/generated/prisma";

export const metadata: Metadata = {
  title: "Projetos",
};

const LIMIT = 20;

type SearchParams = Promise<{
  search?: string;
  status?: string;
  type?: string;
  clientId?: string;
  page?: string;
}>;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const search = params.search?.trim() || undefined;
  const status = params.status as ProjectStatus | undefined;
  const type = params.type as ProjectType | undefined;
  const clientId = params.clientId || undefined;

  const [result, clientsResult] = await Promise.all([
    projectService.list({ search, status, type, clientId, page, limit: LIMIT }),
    clientService.list({ page: 1, limit: 200 }),
  ]);

  const clients = clientsResult.data.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projetos"
        description="Implantações, migrações e suporte em andamento"
      >
        <Button asChild size="sm">
          <Link href="/projects/new">Novo Projeto</Link>
        </Button>
      </PageHeader>

      <Suspense fallback={<FiltersSkeleton />}>
        <ProjectFilters
          clients={clients}
          defaultSearch={params.search ?? ""}
          defaultStatus={params.status ?? ""}
          defaultClientId={params.clientId ?? ""}
        />
      </Suspense>

      {result.data.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="Nenhum projeto encontrado"
          description={
            search || status || type || clientId
              ? "Tente ajustar os filtros de busca."
              : "Projetos são vinculados a um cliente. Cadastre um projeto para começar."
          }
        />
      ) : (
        <>
          <ProjectTable projects={result.data} />
          <Suspense>
            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              total={result.total}
              limit={LIMIT}
            />
          </Suspense>
        </>
      )}
    </div>
  );
}

function FiltersSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-9 w-44" />
      <Skeleton className="h-9 w-52" />
    </div>
  );
}
