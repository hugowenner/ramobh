import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FileStack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { DocumentTable } from "@/modules/documents/components/document-table";
import { DocumentFilters } from "@/modules/documents/components/document-filters";
import { documentService } from "@/modules/documents/services/document.service";
import { templateService } from "@/modules/templates/services/template.service";
import { PAGE_SIZE } from "@/modules/documents/constants";

export const metadata: Metadata = {
  title: "Documentos",
};

const LIMIT = PAGE_SIZE;

type SearchParams = Promise<{
  search?: string;
  status?: string;
  templateId?: string;
  clientId?: string;
  projectId?: string;
  page?: string;
}>;

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const search = params.search?.trim() || undefined;
  const status = params.status || undefined;   // validated by Zod in service
  const templateId = params.templateId || undefined;
  const clientId = params.clientId || undefined;
  const projectId = params.projectId || undefined;

  const [result, activeTemplates] = await Promise.all([
    documentService.list({ search, status, templateId, clientId, projectId, page, limit: LIMIT }),
    templateService.listActive(),
  ]);

  const templateOptions = activeTemplates.map((t) => ({
    id: t.id,
    name: t.name,
  }));

  const hasFilters = !!(search || status || templateId || clientId || projectId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documentos"
        description="Registros técnicos, procedimentos e histórico operacional"
      >
        <Button asChild size="sm">
          <Link href="/documents/new">Novo Documento</Link>
        </Button>
      </PageHeader>

      <Suspense fallback={<FiltersSkeleton />}>
        <DocumentFilters
          templates={templateOptions}
          defaultSearch={params.search ?? ""}
          defaultStatus={params.status ?? ""}
          defaultTemplateId={params.templateId ?? ""}
        />
      </Suspense>

      {result.data.length === 0 ? (
        <EmptyState
          icon={FileStack}
          title="Nenhum documento encontrado"
          description={
            hasFilters
              ? "Tente ajustar os filtros de busca."
              : "Crie um documento a partir de um template vinculado a um cliente ou projeto."
          }
        />
      ) : (
        <>
          <DocumentTable documents={result.data} />
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
