import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";
import type { TemplateSchema } from "../src/modules/templates/types";

const prisma = new PrismaClient();

// ── Helpers ──────────────────────────────────────────────────

function schema(fields: TemplateSchema["fields"]): TemplateSchema {
  return { version: "1", fields };
}

// ── Templates SAP ────────────────────────────────────────────

const templates = [
  {
    name: "Implantação SAP Business One",
    description: "Registro de atividades e configurações durante implantação do SAP B1",
    category: "Implantação",
    schema: schema([
      { id: "client", type: "text", label: "Cliente", required: true },
      { id: "consultant", type: "text", label: "Consultor Responsável", required: true },
      { id: "sap_version", type: "text", label: "Versão SAP B1", required: true, placeholder: "Ex: 10.0 PL22" },
      { id: "db_type", type: "select", label: "Banco de Dados", required: true, options: ["MS SQL Server", "SAP HANA"] },
      { id: "start_date", type: "date", label: "Data de Início", required: true },
      { id: "modules", type: "multiselect", label: "Módulos Implantados", required: true, options: ["Financeiro", "Compras", "Vendas", "Estoque", "Produção", "CRM", "Projetos", "RH"] },
      { id: "activities", type: "steps", label: "Atividades Realizadas", required: true },
      { id: "pending", type: "textarea", label: "Pendências", required: false, placeholder: "Liste as pendências em aberto..." },
      { id: "notes", type: "textarea", label: "Observações Técnicas", required: false },
    ]),
  },
  {
    name: "Troubleshooting SAP B1",
    description: "Registro de análise e resolução de incidentes no SAP Business One",
    category: "Suporte",
    schema: schema([
      { id: "client", type: "text", label: "Cliente", required: true },
      { id: "ticket", type: "text", label: "Número do Ticket", required: false },
      { id: "reporter", type: "text", label: "Reportado por", required: true },
      { id: "incident_date", type: "date", label: "Data do Incidente", required: true },
      { id: "environment", type: "select", label: "Ambiente", required: true, options: ["Produção", "Homologação", "Desenvolvimento"] },
      { id: "module", type: "select", label: "Módulo Afetado", required: true, options: ["Financeiro", "Compras", "Vendas", "Estoque", "Produção", "CRM", "Projetos", "Geral"] },
      { id: "severity", type: "select", label: "Severidade", required: true, options: ["Crítico", "Alto", "Médio", "Baixo"] },
      { id: "description", type: "textarea", label: "Descrição do Problema", required: true, placeholder: "Descreva o problema detalhadamente..." },
      { id: "error_message", type: "textarea", label: "Mensagem de Erro", required: false, placeholder: "Cole a mensagem de erro completa..." },
      { id: "root_cause", type: "textarea", label: "Causa Raiz", required: false },
      { id: "resolution_steps", type: "steps", label: "Passos de Resolução", required: true },
      { id: "resolution_date", type: "date", label: "Data de Resolução", required: false },
      { id: "prevention", type: "textarea", label: "Prevenção Futura", required: false },
    ]),
  },
  {
    name: "Checklist Go-Live SAP",
    description: "Verificações obrigatórias antes e durante o go-live do SAP",
    category: "Go-Live",
    schema: schema([
      { id: "client", type: "text", label: "Cliente", required: true },
      { id: "golive_date", type: "date", label: "Data do Go-Live", required: true },
      { id: "responsible", type: "text", label: "Responsável Técnico", required: true },
      { id: "backup_confirmed", type: "checkbox", label: "Backup do ambiente de produção realizado", required: true },
      { id: "data_migration_validated", type: "checkbox", label: "Migração de dados validada em homologação", required: true },
      { id: "users_trained", type: "checkbox", label: "Usuários-chave treinados", required: true },
      { id: "cutover_plan", type: "steps", label: "Plano de Cutover", required: true },
      { id: "rollback_plan", type: "textarea", label: "Plano de Rollback", required: true, placeholder: "Descreva o procedimento de rollback..." },
      { id: "monitoring_period", type: "text", label: "Período de Monitoramento Pós Go-Live", required: true, placeholder: "Ex: 30 dias" },
      { id: "issues", type: "textarea", label: "Problemas Encontrados", required: false },
      { id: "final_status", type: "select", label: "Status Final", required: true, options: ["Go-Live Realizado com Sucesso", "Go-Live Realizado com Pendências", "Go-Live Cancelado"] },
      { id: "notes", type: "textarea", label: "Observações Finais", required: false },
    ]),
  },
  {
    name: "Migração de Ambiente SAP",
    description: "Documentação de migração entre ambientes (ex: dev → prod, versão upgrade)",
    category: "Migração",
    schema: schema([
      { id: "client", type: "text", label: "Cliente", required: true },
      { id: "source_env", type: "select", label: "Ambiente de Origem", required: true, options: ["Desenvolvimento", "Homologação", "Produção"] },
      { id: "target_env", type: "select", label: "Ambiente de Destino", required: true, options: ["Desenvolvimento", "Homologação", "Produção"] },
      { id: "source_version", type: "text", label: "Versão Origem", required: true },
      { id: "target_version", type: "text", label: "Versão Destino", required: true },
      { id: "migration_date", type: "date", label: "Data da Migração", required: true },
      { id: "responsible", type: "text", label: "Responsável", required: true },
      { id: "pre_checks", type: "steps", label: "Verificações Pré-Migração", required: true },
      { id: "migration_steps", type: "steps", label: "Passos da Migração", required: true },
      { id: "post_checks", type: "steps", label: "Verificações Pós-Migração", required: true },
      { id: "issues", type: "textarea", label: "Problemas Encontrados", required: false },
      { id: "final_status", type: "select", label: "Status Final", required: true, options: ["Concluído com Sucesso", "Concluído com Ressalvas", "Revertido"] },
    ]),
  },
];

// ── Seed function ────────────────────────────────────────────

async function main() {
  console.log("Iniciando seed...");

  // Admin user
  const adminEmail = "admin@ramo.com.br";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashed = await bcrypt.hash("Admin@2026!", 12);
    await prisma.user.create({
      data: {
        name: "Administrador",
        email: adminEmail,
        password: hashed,
        role: "ADMIN",
      },
    });
    console.log(`  ✓ Usuário admin criado: ${adminEmail}`);
  } else {
    console.log("  – Usuário admin já existe, ignorando");
  }

  // Consultant user
  const consultantEmail = "consultor@ramo.com.br";
  const existingConsultant = await prisma.user.findUnique({
    where: { email: consultantEmail },
  });
  if (!existingConsultant) {
    const hashed = await bcrypt.hash("Consultor@2026!", 12);
    await prisma.user.create({
      data: {
        name: "Consultor Demo",
        email: consultantEmail,
        password: hashed,
        role: "ENGINEER",
      },
    });
    console.log(`  ✓ Usuário consultor criado: ${consultantEmail}`);
  } else {
    console.log("  – Usuário consultor já existe, ignorando");
  }

  // Viewer user
  const viewerEmail = "viewer@ramo.com.br";
  const existingViewer = await prisma.user.findUnique({
    where: { email: viewerEmail },
  });
  if (!existingViewer) {
    const hashed = await bcrypt.hash("Viewer@2026!", 12);
    await prisma.user.create({
      data: {
        name: "Viewer Demo",
        email: viewerEmail,
        password: hashed,
        role: "VIEWER",
      },
    });
    console.log(`  ✓ Usuário viewer criado: ${viewerEmail}`);
  } else {
    console.log("  – Usuário viewer já existe, ignorando");
  }

  // Templates
  let created = 0;
  for (const t of templates) {
    const existing = await prisma.template.findFirst({
      where: { name: t.name, deletedAt: null },
    });

    if (!existing) {
      await prisma.template.create({ data: t });
      created++;
      console.log(`  ✓ Template criado: ${t.name}`);
    } else {
      console.log(`  – Template já existe: ${t.name}`);
    }
  }

  console.log(`\nSeed concluído. ${created} template(s) criado(s).`);
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
