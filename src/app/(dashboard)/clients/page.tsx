import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { clientService } from "@/modules/clients/services/client.service";
import { ClientTable } from "@/modules/clients/components/client-table";
import { ClientFilters } from "@/modules/clients/components/client-filters";
import type { ClientStatus } from "@/generated/prisma";

export const metadata: Metadata = {
  title: "Clientes",
};

const LIMIT = 20;

type SearchParams = Promise<{
  search?: string;
  status?: string;
  page?: string;
}>;

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const search = params.search?.trim() || undefined;
  const status = params.status as ClientStatus | undefined;

  const result = await clientService.list({
    search,
    status,
    page,
    limit: LIMIT,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Empresas e organizações atendidas pela Ramo"
      >
        <Button asChild size="sm">
          <Link href="/clients/new">Novo Cliente</Link>
        </Button>
      </PageHeader>

      {/* ClientFilters uses useSearchParams — needs Suspense boundary */}
      <Suspense fallback={<FiltersSkeleton />}>
        <ClientFilters
          defaultSearch={params.search ?? ""}
          defaultStatus={params.status ?? ""}
        />
      </Suspense>

      {result.data.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Nenhum cliente encontrado"
          description={
            search || status
              ? "Tente ajustar os filtros de busca."
              : "Comece cadastrando o primeiro cliente."
          }
        />
      ) : (
        <>
          <ClientTable clients={result.data} />
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
    </div>
  );
}
