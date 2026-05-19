import type { Metadata } from "next";
import { auth } from "@/core/auth/config";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FolderKanban, FileStack, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
};

const stats = [
  {
    label: "Clientes",
    value: "—",
    icon: Building2,
    description: "Clientes cadastrados",
  },
  {
    label: "Projetos Ativos",
    value: "—",
    icon: FolderKanban,
    description: "Em andamento",
  },
  {
    label: "Documentos",
    value: "—",
    icon: FileStack,
    description: "Total de documentos",
  },
  {
    label: "Templates",
    value: "—",
    icon: FileText,
    description: "Templates ativos",
  },
];

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "Bem-vindo";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Olá, ${firstName}`}
        description="Visão geral do Portal Técnico Ramo"
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-slate-900">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-slate-400">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Atividade recente — placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400">
            Histórico de atividades disponível na próxima etapa.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
