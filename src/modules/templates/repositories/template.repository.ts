import { prisma } from "@/core/database/client";
import type { TransactionClient } from "@/core/database/types";
import type { Prisma } from "@/generated/prisma";
import type { TemplateFilters, TemplateSummary } from "../types";

type Db = TransactionClient | typeof prisma;

const SUMMARY_SELECT = {
  id: true,
  name: true,
  description: true,
  category: true,
  isActive: true,
  createdAt: true,
} satisfies Prisma.TemplateSelect;

function buildWhere(filters: TemplateFilters): Prisma.TemplateWhereInput {
  return {
    deletedAt: null,
    ...(filters.category && { category: filters.category }),
    ...(filters.isActive !== undefined && { isActive: filters.isActive }),
    ...(filters.search && {
      name: { contains: filters.search, mode: "insensitive" },
    }),
  };
}

export const templateRepository = {
  async findById(id: string, db: Db = prisma) {
    return db.template.findFirst({ where: { id, deletedAt: null } });
  },

  async findMany(
    filters: TemplateFilters,
    pagination: { skip: number; take: number },
    db: Db = prisma
  ): Promise<{ data: TemplateSummary[]; total: number }> {
    const where = buildWhere(filters);
    const [data, total] = await Promise.all([
      db.template.findMany({
        where,
        select: SUMMARY_SELECT,
        orderBy: [{ category: "asc" }, { name: "asc" }],
        skip: pagination.skip,
        take: pagination.take,
      }),
      db.template.count({ where }),
    ]);
    return { data, total };
  },

  async findActive(db: Db = prisma) {
    return db.template.findMany({
      where: { deletedAt: null, isActive: true },
      select: SUMMARY_SELECT,
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
  },

  async create(data: Prisma.TemplateCreateInput, db: Db = prisma) {
    return db.template.create({ data });
  },

  async update(
    id: string,
    data: Prisma.TemplateUpdateInput,
    db: Db = prisma
  ) {
    return db.template.update({ where: { id, deletedAt: null }, data });
  },

  async softDelete(id: string, db: Db = prisma) {
    return db.template.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date(), isActive: false },
    });
  },

  async listCategories(db: Db = prisma): Promise<string[]> {
    const rows = await db.template.findMany({
      where: { deletedAt: null },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });
    return rows.map((r) => r.category);
  },
};
