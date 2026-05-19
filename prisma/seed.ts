import "dotenv/config";

import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import type { TemplateSchema } from "../src/modules/templates/types";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL não definida");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ── Schema helper ─────────────────────────────────────────────

function schema(
  sections: TemplateSchema["sections"]
): TemplateSchema {
  return { version: "1", sections };
}

// ── Templates SAP ─────────────────────────────────────────────

const templates: Array<{
  name: string;
  description: string;
  category: string;
  schema: TemplateSchema;
}> = [
  {
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

// ── Seed ──────────────────────────────────────────────────────

async function main() {
  console.log("Iniciando seed...");

  // Users
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
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (!existing) {
      const hashed = await bcrypt.hash(u.password, 12);
      await prisma.user.create({
        data: { name: u.name, email: u.email, password: hashed, role: u.role },
      });
      console.log(`  ✓ Usuário criado: ${u.email}`);
    } else {
      console.log(`  – Usuário já existe: ${u.email}`);
    }
  }

  // Templates
  let created = 0;
  for (const t of templates) {
    const existing = await prisma.template.findFirst({
      where: { name: t.name, deletedAt: null },
    });
    if (!existing) {
      await prisma.template.create({
        data: {
          name: t.name,
          description: t.description,
          category: t.category,
          schema: t.schema as object,
        },
      });
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
