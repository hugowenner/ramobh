import { prisma } from "@/core/database/client";
import type { TransactionClient } from "@/core/database/types";
import type { Prisma } from "@/generated/prisma";
import type { DocumentFilters, DocumentSummary } from "../types";

type Db = TransactionClient | typeof prisma;

const SUMMARY_SELECT = {
  id: true,
  title: true,
  status: true,
  clientId: true,
  projectId: true,
  environmentId: true,
  templateId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.DocumentSelect;

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

export const documentRepository = {
  async findById(id: string, db: Db = prisma) {
    return db.document.findFirst({ where: { id, deletedAt: null } });
  },

  async findByIdWithAttachments(id: string, db: Db = prisma) {
    return db.document.findFirst({
      where: { id, deletedAt: null },
      include: { attachments: { orderBy: { createdAt: "asc" } } },
    });
  },

  async findMany(
    filters: DocumentFilters,
    pagination: { skip: number; take: number },
    db: Db = prisma
  ): Promise<{ data: DocumentSummary[]; total: number }> {
    const where = buildWhere(filters);
    const [data, total] = await Promise.all([
      db.document.findMany({
        where,
        select: SUMMARY_SELECT,
        orderBy: { updatedAt: "desc" },
        skip: pagination.skip,
        take: pagination.take,
      }),
      db.document.count({ where }),
    ]);
    return { data, total };
  },

  async create(data: Prisma.DocumentCreateInput, db: Db = prisma) {
    return db.document.create({ data });
  },

  async update(
    id: string,
    data: Prisma.DocumentUpdateInput,
    db: Db = prisma
  ) {
    return db.document.update({ where: { id, deletedAt: null }, data });
  },

  async softDelete(id: string, db: Db = prisma) {
    return db.document.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  },
};
