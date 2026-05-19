import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { ClientForm } from "@/modules/clients/components/client-form";
import { createClientAction } from "@/modules/clients/actions";

export const metadata: Metadata = {
  title: "Novo Cliente",
};

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/clients">
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <PageHeader
        title="Novo Cliente"
        description="Cadastre uma empresa ou organização"
      />

      <ClientForm
        action={createClientAction}
        submitLabel="Criar Cliente"
        redirectTo="/clients"
      />
    </div>
  );
}
