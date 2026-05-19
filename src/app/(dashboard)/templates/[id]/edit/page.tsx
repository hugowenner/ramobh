import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { TemplateForm } from "@/modules/templates/components/template-form";
import { TemplateVersionBadge } from "@/modules/templates/components/template-version-badge";
import { updateTemplateAction } from "@/modules/templates/actions";
import { templateService } from "@/modules/templates/services/template.service";
import { getTemplateVersion } from "@/modules/templates/utils/schema";
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
    return { title: `Editar — ${template.name}` };
  } catch {
    return { title: "Template nao encontrado" };
  }
}

export default async function EditTemplatePage({ params }: { params: Params }) {
  const { id } = await params;

  let template;
  try {
    template = await templateService.getTemplateById(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  const categories = await templateService.listCategories();
  const boundAction = updateTemplateAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/templates/${id}`}>
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <PageHeader
        title={`Editar — ${template.name}`}
        description="Atualize os dados do template"
      />

      <div className="rounded-md border p-4 text-sm">
        <span className="text-muted-foreground">
          Versao do schema (somente leitura)
        </span>{" "}
        <TemplateVersionBadge version={getTemplateVersion(template.schema)} />
      </div>

      <TemplateForm
        action={boundAction}
        categories={categories}
        defaultValues={template}
        submitLabel="Salvar Alteracoes"
        redirectTo={`/templates/${id}`}
      />
    </div>
  );
}
