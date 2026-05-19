import "dotenv/config";

import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import type { TemplateSchema } from "../src/modules/templates/types";
import { toSlug } from "../src/modules/templates/utils/schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL não definida");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function schema(sections: TemplateSchema["sections"]): TemplateSchema {
  return { version: "1", sections };
}

// ── Templates SAP ──────────────────────────────────────────────

const templates: Array<{
  slug: string;
  name: string;
  description: string;
  category: string;
  schema: TemplateSchema;
}> = [
  {
    slug: "implantacao-sap-business-one",
    name: "Implantação SAP Business One",
    description:
      "Registro de atividades e configurações durante implantação do SAP B1",
    category: "Implantação",
    schema: schema([
      {
        id: "identification",
        title: "Identificação",
        fields: [
          { id: "client", type: "text", label: "Cliente", required: true },
          {
            id: "consultant",
            type: "text",
            label: "Consultor Responsável",
            required: true,
          },
          {
            id: "sap_version",
            type: "text",
            label: "Versão SAP B1",
            required: true,
            placeholder: "Ex: 10.0 PL22",
          },
          {
            id: "db_type",
            type: "select",
            label: "Banco de Dados",
            required: true,
            options: ["MS SQL Server", "SAP HANA"],
          },
          {
            id: "start_date",
            type: "date",
            label: "Data de Início",
            required: true,
          },
        ],
      },
      {
        id: "execution",
        title: "Execução",
        fields: [
          {
            id: "pending",
            type: "textarea",
            label: "Pendências",
            required: false,
            placeholder: "Liste as pendências em aberto...",
          },
          {
            id: "notes",
            type: "textarea",
            label: "Observações Técnicas",
            required: false,
          },
        ],
      },
    ]),
  },
  {
    slug: "troubleshooting-sap-b1",
    name: "Troubleshooting SAP B1",
    description:
      "Registro de análise e resolução de incidentes no SAP Business One",
    category: "Suporte",
    schema: schema([
      {
        id: "incident",
        title: "Dados do Incidente",
        fields: [
          { id: "client", type: "text", label: "Cliente", required: true },
          {
            id: "ticket",
            type: "text",
            label: "Número do Ticket",
            required: false,
          },
          {
            id: "reporter",
            type: "text",
            label: "Reportado por",
            required: true,
          },
          {
            id: "incident_date",
            type: "date",
            label: "Data do Incidente",
            required: true,
          },
          {
            id: "environment",
            type: "select",
            label: "Ambiente",
            required: true,
            options: ["Produção", "Homologação", "Desenvolvimento"],
          },
          {
            id: "severity",
            type: "select",
            label: "Severidade",
            required: true,
            options: ["Crítico", "Alto", "Médio", "Baixo"],
          },
        ],
      },
      {
        id: "diagnosis",
        title: "Diagnóstico e Resolução",
        fields: [
          {
            id: "description",
            type: "textarea",
            label: "Descrição do Problema",
            required: true,
            placeholder: "Descreva o problema detalhadamente...",
          },
          {
            id: "error_message",
            type: "textarea",
            label: "Mensagem de Erro",
            required: false,
            placeholder: "Cole a mensagem de erro completa...",
          },
          {
            id: "root_cause",
            type: "textarea",
            label: "Causa Raiz",
            required: false,
          },
          {
            id: "prevention",
            type: "textarea",
            label: "Prevenção Futura",
            required: false,
          },
        ],
      },
    ]),
  },
  {
    slug: "checklist-go-live-sap",
    name: "Checklist Go-Live SAP",
    description: "Verificações obrigatórias antes e durante o go-live do SAP",
    category: "Go-Live",
    schema: schema([
      {
        id: "identification",
        title: "Identificação",
        fields: [
          { id: "client", type: "text", label: "Cliente", required: true },
          {
            id: "golive_date",
            type: "date",
            label: "Data do Go-Live",
            required: true,
          },
          {
            id: "responsible",
            type: "text",
            label: "Responsável Técnico",
            required: true,
          },
        ],
      },
      {
        id: "checklist",
        title: "Verificações",
        fields: [
          {
            id: "backup_confirmed",
            type: "checkbox",
            label: "Backup do ambiente de produção realizado",
            required: true,
          },
          {
            id: "data_migration_validated",
            type: "checkbox",
            label: "Migração de dados validada em homologação",
            required: true,
          },
          {
            id: "users_trained",
            type: "checkbox",
            label: "Usuários-chave treinados",
            required: true,
          },
        ],
      },
      {
        id: "result",
        title: "Resultado",
        fields: [
          {
            id: "final_status",
            type: "select",
            label: "Status Final",
            required: true,
            options: [
              "Go-Live Realizado com Sucesso",
              "Go-Live Realizado com Pendências",
              "Go-Live Cancelado",
            ],
          },
          {
            id: "notes",
            type: "textarea",
            label: "Observações Finais",
            required: false,
          },
        ],
      },
    ]),
  },
  {
    slug: "migracao-de-ambiente-sap",
    name: "Migração de Ambiente SAP",
    description:
      "Documentação de migração entre ambientes (ex: dev → prod, versão upgrade)",
    category: "Migração",
    schema: schema([
      {
        id: "identification",
        title: "Identificação",
        fields: [
          { id: "client", type: "text", label: "Cliente", required: true },
          {
            id: "source_env",
            type: "select",
            label: "Ambiente de Origem",
            required: true,
            options: ["Desenvolvimento", "Homologação", "Produção"],
          },
          {
            id: "target_env",
            type: "select",
            label: "Ambiente de Destino",
            required: true,
            options: ["Desenvolvimento", "Homologação", "Produção"],
          },
          {
            id: "source_version",
            type: "text",
            label: "Versão Origem",
            required: true,
          },
          {
            id: "target_version",
            type: "text",
            label: "Versão Destino",
            required: true,
          },
          {
            id: "migration_date",
            type: "date",
            label: "Data da Migração",
            required: true,
          },
          {
            id: "responsible",
            type: "text",
            label: "Responsável",
            required: true,
          },
        ],
      },
      {
        id: "result",
        title: "Resultado",
        fields: [
          {
            id: "issues",
            type: "textarea",
            label: "Problemas Encontrados",
            required: false,
          },
          {
            id: "final_status",
            type: "select",
            label: "Status Final",
            required: true,
            options: [
              "Concluído com Sucesso",
              "Concluído com Ressalvas",
              "Revertido",
            ],
          },
        ],
      },
    ]),
  },
];

// Verify slugs match toSlug(name) at runtime — catches typos in explicit slug strings
for (const t of templates) {
  const derived = toSlug(t.name);
  if (t.slug !== derived) {
    throw new Error(
      `Seed slug mismatch for "${t.name}": explicit="${t.slug}" derived="${derived}"`
    );
  }
}

// ── Seed ───────────────────────────────────────────────────────

async function main() {
  console.log("Iniciando seed...");

  // ── Users ────────────────────────────────────────────────────
  const users = [
    {
      email: "admin@ramo.com.br",
      name: "Administrador",
      password: "Admin@2026!",
      role: "ADMIN" as const,
    },
    {
      email: "consultor@ramo.com.br",
      name: "Consultor Demo",
      password: "Consultor@2026!",
      role: "ENGINEER" as const,
    },
    {
      email: "viewer@ramo.com.br",
      name: "Viewer Demo",
      password: "Viewer@2026!",
      role: "VIEWER" as const,
    },
  ];

  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 12);
    await prisma.user.upsert({
      where: { email: u.email },
      create: {
        name: u.name,
        email: u.email,
        password: hashed,
        role: u.role,
      },
      update: {
        name: u.name,
        role: u.role,
        // Password intentionally NOT updated on re-seed to preserve manual changes
      },
    });
    console.log(`  ✓ Usuário: ${u.email}`);
  }

  // ── Templates ────────────────────────────────────────────────
  // upsert by slug — always keeps schema in sync with seed source.
  // Adding a new template: add entry here, re-run seed.
  // Updating a template schema: edit entry here, re-run seed (schema updates automatically).
  // Renaming a template: update name here; slug stays the same (stable key).

  for (const t of templates) {
    await prisma.template.upsert({
      where: { slug: t.slug },
      create: {
        slug: t.slug,
        name: t.name,
        description: t.description,
        category: t.category,
        schema: t.schema as object,
        isActive: true,
      },
      update: {
        name: t.name,
        description: t.description,
        category: t.category,
        schema: t.schema as object,
        // isActive and deletedAt intentionally NOT overwritten —
        // manual deactivation via UI is preserved across re-seeds.
        updatedAt: new Date(),
      },
    });
    console.log(`  ✓ Template: ${t.name}`);
  }

  console.log(`\nSeed concluído. ${templates.length} template(s) sincronizados.`);
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
