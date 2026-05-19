import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { templateService } from "@/modules/templates/services/template.service";
import { PAGE_SIZE } from "@/modules/templates/constants";
import { TemplateTable } from "@/modules/templates/components/template-table";
import { TemplateFilters } from "@/modules/templates/components/template-filters";

export const metadata: Metadata = {
  title: "Templates",
};

const LIMIT = PAGE_SIZE;

type SearchParams = Promise<{
  search?: string;
  category?: string;
  page?: string;
}>;

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const search = params.search?.trim() || undefined;
  const category = params.category || undefined;

  const [result, categories] = await Promise.all([
    templateService.listTemplates({
      search,
      category,
      page,
      limit: LIMIT,
    }),
    templateService.listCategories(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Templates"
        description="Formulários padronizados para documentação técnica"
      >
        <Button asChild size="sm">
          <Link href="/templates/new">Novo Template</Link>
        </Button>
      </PageHeader>

      <Suspense fallback={<FiltersSkeleton />}>
        <TemplateFilters
          categories={categories}
          defaultSearch={params.search ?? ""}
          defaultCategory={params.category ?? ""}
        />
      </Suspense>

      {result.data.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nenhum template encontrado"
          description={
            search || category
              ? "Tente ajustar os filtros de busca."
              : "Execute o seed do banco para carregar os templates SAP padrão."
          }
        />
      ) : (
        <>
          <TemplateTable templates={result.data} />
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
