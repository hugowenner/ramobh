import type { Metadata } from "next";
import { auth } from "@/core/auth/config";
import { prisma } from "@/core/database/client";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FolderKanban, FileStack, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "Bem-vindo";

  // 4 counts em paralelo — 1 round-trip para o banco
  const [totalClients, activeProjects, totalDocuments, activeTemplates] =
    await Promise.all([
      prisma.client.count({
        where: { deletedAt: null },
      }),
      prisma.project.count({
        where: {
          deletedAt: null,
          status: { notIn: ["COMPLETED", "CANCELLED"] },
        },
      }),
      prisma.document.count({
        where: { deletedAt: null },
      }),
      prisma.template.count({
        where: { deletedAt: null, isActive: true },
      }),
    ]);

  const stats = [
    {
      label: "Clientes",
      value: totalClients,
      icon: Building2,
      description: "Clientes cadastrados",
    },
    {
      label: "Projetos Ativos",
      value: activeProjects,
      icon: FolderKanban,
      description: "Em andamento",
    },
    {
      label: "Documentos",
      value: totalDocuments,
      icon: FileStack,
      description: "Total de documentos",
    },
    {
      label: "Templates",
      value: activeTemplates,
      icon: FileText,
      description: "Templates ativos",
    },
  ];

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
              <CardTitle className="text-sm font-medium text-ramo-muted">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-ramo-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-ramo-text tabular-nums">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-ramo-muted">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Atividade recente — placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-ramo-text">
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-ramo-muted">
            Histórico de atividades disponível na próxima etapa.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
