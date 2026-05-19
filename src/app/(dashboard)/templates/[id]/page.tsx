import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, FileText, Layers, ListChecks, Tag, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { TemplateSchemaPreview } from "@/components/template-schema-preview";
import { TemplateVersionBadge } from "@/modules/templates/components/template-version-badge";
import { DeleteTemplateButton } from "@/modules/templates/components/delete-template-button";
import { templateService } from "@/modules/templates/services/template.service";
import {
  extractFieldCount,
  extractSectionCount,
  getTemplateVersion,
} from "@/modules/templates/utils/schema";
import { NotFoundError } from "@/core/errors";

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const template = await templateService.getTemplateById(id);
    return { title: template.name };
  } catch {
    return { title: "Template nao encontrado" };
  }
}

export default async function TemplateDetailPage({ params }: { params: Params }) {
  const { id } = await params;

  let template;
  try {
    template = await templateService.getTemplateById(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  const version = getTemplateVersion(template.schema);
  const sectionCount = extractSectionCount(template.schema);
  const fieldCount = extractFieldCount(template.schema);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/templates">
            <ChevronLeft className="h-4 w-4" />
            Templates
          </Link>
        </Button>
      </div>

      <PageHeader title={template.name} description="Detalhes do template">
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/templates/${id}/edit`}>Editar</Link>
          </Button>
          <DeleteTemplateButton
            id={template.id}
            name={template.name}
            redirectAfter="/templates"
          />
        </div>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard icon={Tag} label="Categoria">
          {template.category}
        </InfoCard>
        <InfoCard icon={Layers} label="Versao">
          <TemplateVersionBadge version={version} />
        </InfoCard>
        <InfoCard icon={ListChecks} label="Secoes">
          {sectionCount}
        </InfoCard>
        <InfoCard icon={ListChecks} label="Fields">
          {fieldCount}
        </InfoCard>
        <InfoCard icon={Clock} label="Atualizado em">
          {formatDateDisplay(template.updatedAt)}
        </InfoCard>
      </div>

      {template.description && (
        <div className="rounded-md border p-4 space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Descricao</p>
          <p className="text-sm whitespace-pre-wrap">{template.description}</p>
        </div>
      )}

      <div className="rounded-md border p-4 space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Secoes</p>
        <div className="space-y-2">
          {template.schema.sections.map((section) => (
            <div
              key={section.id}
              className="flex items-center justify-between text-sm"
            >
              <span>{section.title}</span>
              <span className="text-muted-foreground">
                {section.fields.length} fields
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md border p-4 space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileText className="h-4 w-4" />
          <p className="text-xs font-medium uppercase tracking-wide">
            Preview do Schema
          </p>
        </div>
        <TemplateSchemaPreview schema={template.schema} />
      </div>

      <details className="rounded-md border p-4">
        <summary className="cursor-pointer text-sm font-medium">
          Ver JSON
        </summary>
        <pre className="mt-3 max-h-96 overflow-auto rounded-md bg-muted/40 p-3 text-xs">
          {JSON.stringify(template.schema, null, 2)}
        </pre>
      </details>
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

function formatDateDisplay(date?: Date | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
}
