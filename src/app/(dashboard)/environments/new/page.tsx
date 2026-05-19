import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { EnvironmentForm } from "@/modules/environments/components/environment-form";
import { createEnvironmentAction } from "@/modules/environments/actions";
import { clientService } from "@/modules/clients/services/client.service";

export const metadata: Metadata = {
  title: "Novo Ambiente",
};

export default async function NewEnvironmentPage() {
  const clientsResult = await clientService.list({ page: 1, limit: 200 });
  const clients = clientsResult.data.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/environments">
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <PageHeader
        title="Novo Ambiente"
        description="Registre uma instância SAP de um cliente"
      />

      <EnvironmentForm
        action={createEnvironmentAction}
        clients={clients}
        initialProjects={[]}
        submitLabel="Criar Ambiente"
        redirectTo="/environments"
      />
    </div>
  );
}
