import type { Metadata } from "next";
import { Server } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Ambientes",
};

export default function EnvironmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Ambientes"
        description="Produção, homologação e desenvolvimento dos clientes"
      >
        <Button size="sm" disabled>
          Novo Ambiente
        </Button>
      </PageHeader>

      <EmptyState
        icon={Server}
        title="Nenhum ambiente cadastrado"
        description="Ambientes registram as instâncias SAP de cada cliente (produção, homologação, etc.)."
      />
    </div>
  );
}
