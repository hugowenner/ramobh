import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Templates",
};

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Templates"
        description="Formulários padronizados para documentação técnica"
      >
        <Button size="sm" disabled>
          Novo Template
        </Button>
      </PageHeader>

      <EmptyState
        icon={FileText}
        title="Nenhum template disponível"
        description="Execute o seed do banco para carregar os templates SAP padrão da Ramo."
      />
    </div>
  );
}
