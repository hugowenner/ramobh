import type { Metadata } from "next";
import { FileStack } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Documentos",
};

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Documentos"
        description="Registros técnicos, procedimentos e histórico operacional"
      >
        <Button size="sm" disabled>
          Novo Documento
        </Button>
      </PageHeader>

      <EmptyState
        icon={FileStack}
        title="Nenhum documento encontrado"
        description="Documentos são criados a partir de templates vinculados a clientes e projetos."
      />
    </div>
  );
}
