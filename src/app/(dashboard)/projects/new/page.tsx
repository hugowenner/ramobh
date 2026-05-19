import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { ProjectForm } from "@/modules/projects/components/project-form";
import { createProjectAction } from "@/modules/projects/actions";
import { clientService } from "@/modules/clients/services/client.service";

export const metadata: Metadata = {
  title: "Novo Projeto",
};

export default async function NewProjectPage() {
  const clientsResult = await clientService.list({ page: 1, limit: 200 });
  const clients = clientsResult.data.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/projects">
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <PageHeader
        title="Novo Projeto"
        description="Vincule um projeto a um cliente"
      />

      <ProjectForm
        action={createProjectAction}
        clients={clients}
        submitLabel="Criar Projeto"
        redirectTo="/projects"
      />
    </div>
  );
}
