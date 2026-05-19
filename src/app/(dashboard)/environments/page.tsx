import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { environmentService } from "@/modules/environments/services/environment.service";
import { clientService } from "@/modules/clients/services/client.service";
import { getProjectOptionsByClient } from "@/modules/projects/actions";
import { EnvironmentTable } from "@/modules/environments/components/environment-table";
import { EnvironmentFilters } from "@/modules/environments/components/environment-filters";
import type { EnvironmentType } from "@/generated/prisma";

export const metadata: Metadata = {
  title: "Ambientes",
};

const LIMIT = 20;

type SearchParams = Promise<{
  search?: string;
  type?: string;
  clientId?: string;
  projectId?: string;
  page?: string;
}>;

export default async function EnvironmentsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const search = params.search?.trim() || undefined;
  const type = params.type as EnvironmentType | undefined;
  const clientId = params.clientId || undefined;
  const projectId = params.projectId || undefined;

  const [result, clientsResult, initialProjects] = await Promise.all([
    environmentService.list({ search, type, clientId, projectId, page, limit: LIMIT }),
    clientService.list({ page: 1, limit: 200 }),
    clientId ? getProjectOptionsByClient(clientId) : Promise.resolve([]),
  ]);

  const clients = clientsResult.data.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ambientes"
        description="Produção, homologação e desenvolvimento dos clientes"
      >
        <Button asChild size="sm">
          <Link href="/environments/new">Novo Ambiente</Link>
        </Button>
      </PageHeader>

      <Suspense fallback={<FiltersSkeleton />}>
        <EnvironmentFilters
          clients={clients}
          initialProjects={initialProjects}
          defaultSearch={params.search ?? ""}
          defaultType={params.type ?? ""}
          defaultClientId={params.clientId ?? ""}
          defaultProjectId={params.projectId ?? ""}
        />
      </Suspense>

      {result.data.length === 0 ? (
        <EmptyState
          icon={Server}
          title="Nenhum ambiente encontrado"
          description={
            search || type || clientId || projectId
              ? "Tente ajustar os filtros de busca."
              : "Ambientes registram as instâncias SAP de cada cliente (produção, homologação, etc.)."
          }
        />
      ) : (
        <>
          <EnvironmentTable environments={result.data} />
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
