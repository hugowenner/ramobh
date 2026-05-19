import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { DocumentForm } from "@/modules/documents/components/document-form";
import { createDocumentAction } from "@/modules/documents/actions";
import { templateService } from "@/modules/templates/services/template.service";
import { clientService } from "@/modules/clients/services/client.service";

export const metadata: Metadata = {
  title: "Novo Documento",
};

export default async function NewDocumentPage() {
  const [activeTemplates, clientsResult] = await Promise.all([
    templateService.listActive(),
    clientService.list({ page: 1, limit: 200 }),
  ]);

  const templates = activeTemplates.map((t) => ({
    id: t.id,
    name: t.name,
    category: t.category,
  }));

  const clients = clientsResult.data.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/documents">
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <PageHeader
        title="Novo Documento"
        description="Preencha o formulário a partir de um template"
      />

      <DocumentForm
        action={createDocumentAction}
        templates={templates}
        clients={clients}
        initialProjects={[]}
        initialEnvironments={[]}
        submitLabel="Criar Documento"
        redirectTo="/documents"
      />
    </div>
  );
}
