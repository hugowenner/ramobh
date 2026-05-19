import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { DocumentForm } from "@/modules/documents/components/document-form";
import { DocumentStatusBadge } from "@/modules/documents/components/document-status-badge";
import { updateDocumentAction } from "@/modules/documents/actions";
import { documentService } from "@/modules/documents/services/document.service";
import { clientService } from "@/modules/clients/services/client.service";
import { getProjectOptionsByClient } from "@/modules/projects/actions";
import { getEnvironmentOptionsByClient } from "@/modules/environments/actions";
import { NotFoundError } from "@/core/errors";

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const doc = await documentService.getById(id);
    return { title: `Editar — ${doc.title}` };
  } catch {
    return { title: "Documento não encontrado" };
  }
}

export default async function EditDocumentPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  let defaults;
  try {
    defaults = await documentService.getForEdit(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  // Pre-load relation options — cascade from the saved clientId
  const [clientsResult, initialProjects, initialEnvironments] =
    await Promise.all([
      clientService.list({ page: 1, limit: 200 }),
      defaults.clientId
        ? getProjectOptionsByClient(defaults.clientId)
        : Promise.resolve([]),
      defaults.clientId
        ? getEnvironmentOptionsByClient(defaults.clientId)
        : Promise.resolve([]),
    ]);

  const clients = clientsResult.data.map((c) => ({ id: c.id, name: c.name }));
  const boundAction = updateDocumentAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/documents/${id}`}>
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <PageHeader
        title={`Editar — ${defaults.title}`}
        description="Atualize os campos do documento"
      />

      {/* Status badge — read-only in edit form */}
      <div className="flex items-center gap-2 rounded-md border p-3 text-sm">
        <span className="text-muted-foreground">Status atual:</span>
        <DocumentStatusBadge status={defaults.status} />
        <span className="ml-auto text-xs text-muted-foreground">
          Para alterar o status, use a página de detalhes
        </span>
      </div>

      <DocumentForm
        action={boundAction}
        clients={clients}
        initialProjects={initialProjects}
        initialEnvironments={initialEnvironments}
        defaultValues={defaults}
        submitLabel="Salvar Alterações"
        redirectTo={`/documents/${id}`}
      />
    </div>
  );
}
