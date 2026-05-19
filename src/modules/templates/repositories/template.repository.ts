import { prisma } from "@/core/database/client";
import type { TransactionClient } from "@/core/database/types";
import type { Prisma } from "@/generated/prisma";
import type { TemplateFilters } from "../types";

type Db = TransactionClient | typeof prisma;

const LIST_SELECT = {
  id: true,
  name: true,
  category: true,
  schema: true,
  updatedAt: true,
} satisfies Prisma.TemplateSelect;

const DETAIL_SELECT = {
  id: true,
  name: true,
  description: true,
  category: true,
  schema: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.TemplateSelect;

const EDIT_SELECT = {
  id: true,
  name: true,
  description: true,
  category: true,
  schema: true,
  isActive: true,
} satisfies Prisma.TemplateSelect;

type TemplateListRow = Prisma.TemplateGetPayload<{ select: typeof LIST_SELECT }>;
type TemplateDetailRow = Prisma.TemplateGetPayload<{ select: typeof DETAIL_SELECT }>;
type TemplateEditRow = Prisma.TemplateGetPayload<{ select: typeof EDIT_SELECT }>;

function buildWhere(filters: TemplateFilters): Prisma.TemplateWhereInput {
  return {
    deletedAt: null,
    ...(filters.category && { category: filters.category }),
    ...(filters.isActive !== undefined && { isActive: filters.isActive }),
    ...(filters.search && {
      OR: [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { category: { contains: filters.search, mode: "insensitive" } },
      ],
    }),
  };
}

export const templateRepository = {
  async findById(id: string, db: Db = prisma): Promise<TemplateDetailRow | null> {
    return db.template.findFirst({
      where: { id, deletedAt: null },
      select: DETAIL_SELECT,
    });
  },

  async findMany(
    filters: TemplateFilters,
    pagination: { skip: number; take: number },
    db: Db = prisma
  ): Promise<TemplateListRow[]> {
    return db.template.findMany({
      where: buildWhere(filters),
      select: LIST_SELECT,
      orderBy: [{ category: "asc" }, { name: "asc" }],
      skip: pagination.skip,
      take: pagination.take,
    });
  },

  async count(filters: TemplateFilters, db: Db = prisma): Promise<number> {
    return db.template.count({ where: buildWhere(filters) });
  },

  async findActive(db: Db = prisma): Promise<TemplateListRow[]> {
    return db.template.findMany({
      where: { deletedAt: null, isActive: true },
      select: LIST_SELECT,
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
  },

  async create(
    data: Prisma.TemplateCreateInput,
    db: Db = prisma
  ): Promise<TemplateEditRow> {
    return db.template.create({ data, select: EDIT_SELECT });
  },

  async update(
    id: string,
    data: Prisma.TemplateUpdateInput,
    db: Db = prisma
  ): Promise<TemplateEditRow> {
    return db.template.update({
      where: { id, deletedAt: null },
      data,
      select: EDIT_SELECT,
    });
  },

  async softDelete(id: string, db: Db = prisma) {
    return db.template.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date(), isActive: false },
      select: { id: true },
    });
  },

  async existsByName(
    name: string,
    excludeId?: string,
    db: Db = prisma
  ): Promise<boolean> {
    const record = await db.template.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        deletedAt: null,
        ...(excludeId && { id: { not: excludeId } }),
      },
      select: { id: true },
    });
    return record !== null;
  },

  async listCategories(db: Db = prisma): Promise<string[]> {
    const rows = await db.template.findMany({
      where: { deletedAt: null },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });
    return rows.map((row) => row.category);
  },
};
