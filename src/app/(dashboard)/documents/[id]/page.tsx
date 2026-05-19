import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  User,
  Building2,
  FolderOpen,
  Server,
  Clock,
  FileStack,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { DocumentStatusBadge } from "@/modules/documents/components/document-status-badge";
import { DocumentStatusActions } from "@/modules/documents/components/document-status-actions";
import { DeleteDocumentButton } from "@/modules/documents/components/delete-document-button";
import { DynamicDocumentViewer } from "@/modules/documents/components/dynamic-document-viewer";
import { documentService } from "@/modules/documents/services/document.service";
import { pdfGenerationService } from "@/modules/pdf/services/pdf-generation.service";
import { GeneratePdfButton } from "@/modules/pdf/components/generate-pdf-button";
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
    return { title: doc.title };
  } catch {
    return { title: "Documento não encontrado" };
  }
}

export default async function DocumentDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  let doc;
  try {
    doc = await documentService.getById(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  // Latest generated PDF (null if never generated)
  const latestPdf = await pdfGenerationService.getLatestForDocument(id);

  return (
    <div className="space-y-6">
      {/* Back */}
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/documents">
            <ChevronLeft className="h-4 w-4" />
            Documentos
          </Link>
        </Button>
      </div>

      {/* Header */}
      <PageHeader title={doc.title} description="Documento técnico">
        <div className="flex flex-wrap gap-2">
          <GeneratePdfButton
            documentId={doc.id}
            existingDownloadUrl={latestPdf ? `/api/documents/${doc.id}/pdf` : undefined}
          />
          <Button asChild variant="outline" size="sm">
            <Link href={`/documents/${id}/edit`}>Editar</Link>
          </Button>
          <DeleteDocumentButton
            id={doc.id}
            title={doc.title}
            redirectAfter="/documents"
          />
        </div>
      </PageHeader>

      {/* Status + transitions */}
      <div className="flex flex-wrap items-center gap-4 rounded-md border p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <DocumentStatusBadge status={doc.status} />
        </div>
        <DocumentStatusActions
          documentId={doc.id}
          currentStatus={doc.status}
        />
      </div>

      {/* Metadata grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetaCard icon={FileStack} label="Template">
          {doc.template ? (
            <Link
              href={`/templates/${doc.template.id}`}
              className="hover:underline"
            >
              {doc.template.name}
            </Link>
          ) : (
            "—"
          )}
        </MetaCard>
        <MetaCard icon={Building2} label="Cliente">
          {doc.client ? (
            <Link
              href={`/clients/${doc.client.id}`}
              className="hover:underline"
            >
              {doc.client.name}
            </Link>
          ) : (
            "—"
          )}
        </MetaCard>
        <MetaCard icon={FolderOpen} label="Projeto">
          {doc.project ? (
            <Link
              href={`/projects/${doc.project.id}`}
              className="hover:underline"
            >
              {doc.project.name}
            </Link>
          ) : (
            "—"
          )}
        </MetaCard>
        <MetaCard icon={Server} label="Ambiente">
          {doc.environment ? (
            <Link
              href={`/environments/${doc.environment.id}`}
              className="hover:underline"
            >
              {doc.environment.name}
            </Link>
          ) : (
            "—"
          )}
        </MetaCard>
        <MetaCard icon={User} label="Criado por">
          {doc.createdBy?.name ?? doc.createdBy?.id ?? "—"}
        </MetaCard>
        <MetaCard icon={Clock} label="Criado em">
          {fmt(doc.createdAt)}
        </MetaCard>
        <MetaCard icon={Clock} label="Atualizado em">
          {fmt(doc.updatedAt)}
        </MetaCard>
        <MetaCard icon={FileStack} label="Versão do template">
          v{doc.templateVersion}
        </MetaCard>
        <MetaCard icon={FileStack} label="Último PDF gerado">
          {latestPdf ? (
            <span title={latestPdf.filename}>
              {fmt(latestPdf.generatedAt)}
              <span className="ml-1 text-xs text-muted-foreground font-normal">
                ({Math.round(latestPdf.size / 1024)} KB)
              </span>
            </span>
          ) : (
            "Nenhum"
          )}
        </MetaCard>
      </div>

      {/* Dynamic fields */}
      <div className="rounded-md border p-6">
        <DynamicDocumentViewer
          schema={doc.schemaSnapshot}
          data={doc.data}
        />
      </div>
    </div>
  );
}

// ── Local helpers ─────────────────────────────────────────────

function fmt(date?: Date | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function MetaCard({
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
