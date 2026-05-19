import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { TemplateForm } from "@/modules/templates/components/template-form";
import { createTemplateAction } from "@/modules/templates/actions";
import { templateService } from "@/modules/templates/services/template.service";

export const metadata: Metadata = {
  title: "Novo Template",
};

export default async function NewTemplatePage() {
  const categories = await templateService.listCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/templates">
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <PageHeader
        title="Novo Template"
        description="Crie um novo formulário padronizado"
      />

      <TemplateForm
        action={createTemplateAction}
        categories={categories}
        submitLabel="Criar Template"
        redirectTo="/templates"
      />
    </div>
  );
}
