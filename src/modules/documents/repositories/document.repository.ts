import { prisma } from "@/core/database/client";
import type { TransactionClient } from "@/core/database/types";
import type { Prisma } from "@/generated/prisma";
import type { DocumentFilters } from "../types";

type Db = TransactionClient | typeof prisma;

// ── Selects ───────────────────────────────────────────────────

const LIST_SELECT = {
  id: true,
  title: true,
  status: true,
  templateVersion: true,
  createdAt: true,
  updatedAt: true,
  template: { select: { id: true, name: true, category: true } },
  client: { select: { id: true, name: true } },
  project: { select: { id: true, name: true } },
  createdBy: { select: { id: true, name: true } },
} satisfies Prisma.DocumentSelect;

const DETAIL_SELECT = {
  id: true,
  title: true,
  status: true,
  templateId: true,
  templateVersion: true,
  schemaSnapshot: true,
  data: true,
  clientId: true,
  projectId: true,
  environmentId: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
  template: { select: { id: true, name: true, category: true } },
  client: { select: { id: true, name: true } },
  project: { select: { id: true, name: true } },
  environment: { select: { id: true, name: true } },
  createdBy: { select: { id: true, name: true } },
} satisfies Prisma.DocumentSelect;

const EDIT_SELECT = {
  id: true,
  title: true,
  status: true,
  templateId: true,
  templateVersion: true,
  schemaSnapshot: true,
  data: true,
  clientId: true,
  projectId: true,
  environmentId: true,
} satisfies Prisma.DocumentSelect;

// ── Row types ─────────────────────────────────────────────────

export type DocumentListRow = Prisma.DocumentGetPayload<{
  select: typeof LIST_SELECT;
}>;
export type DocumentDetailRow = Prisma.DocumentGetPayload<{
  select: typeof DETAIL_SELECT;
}>;
export type DocumentEditRow = Prisma.DocumentGetPayload<{
  select: typeof EDIT_SELECT;
}>;

// ── Where builder ─────────────────────────────────────────────

function buildWhere(filters: DocumentFilters): Prisma.DocumentWhereInput {
  return {
    deletedAt: null,
    ...(filters.status && { status: filters.status }),
    ...(filters.clientId && { clientId: filters.clientId }),
    ...(filters.projectId && { projectId: filters.projectId }),
    ...(filters.templateId && { templateId: filters.templateId }),
    ...(filters.search && {
      title: { contains: filters.search, mode: "insensitive" },
    }),
  };
}

// ── Repository ────────────────────────────────────────────────

export const documentRepository = {
  async findById(
    id: string,
    db: Db = prisma
  ): Promise<DocumentDetailRow | null> {
    return db.document.findFirst({
      where: { id, deletedAt: null },
      select: DETAIL_SELECT,
    });
  },

  async findForEdit(
    id: string,
    db: Db = prisma
  ): Promise<DocumentEditRow | null> {
    return db.document.findFirst({
      where: { id, deletedAt: null },
      select: EDIT_SELECT,
    });
  },

  async findMany(
    filters: DocumentFilters,
    pagination: { skip: number; take: number },
    db: Db = prisma
  ): Promise<DocumentListRow[]> {
    return db.document.findMany({
      where: buildWhere(filters),
      select: LIST_SELECT,
      orderBy: { updatedAt: "desc" },
      skip: pagination.skip,
      take: pagination.take,
    });
  },

  async count(filters: DocumentFilters, db: Db = prisma): Promise<number> {
    return db.document.count({ where: buildWhere(filters) });
  },

  async create(
    data: Prisma.DocumentCreateInput,
    db: Db = prisma
  ): Promise<DocumentEditRow> {
    return db.document.create({ data, select: EDIT_SELECT });
  },

  async update(
    id: string,
    data: Prisma.DocumentUpdateInput,
    db: Db = prisma
  ): Promise<DocumentEditRow> {
    return db.document.update({
      where: { id, deletedAt: null },
      data,
      select: EDIT_SELECT,
    });
  },

  async softDelete(id: string, db: Db = prisma): Promise<void> {
    await db.document.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
      select: { id: true },
    });
  },
};
