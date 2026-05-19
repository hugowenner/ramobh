import { prisma } from "@/core/database/client";
import type { TransactionClient } from "@/core/database/types";
import type { Prisma } from "@/generated/prisma";
import type { EnvironmentFilters, EnvironmentSummary } from "../types";

type Db = TransactionClient | typeof prisma;

const SUMMARY_SELECT = {
  id: true,
  name: true,
  type: true,
  description: true,
  clientId: true,
  projectId: true,
  url: true,
  version: true,
  createdAt: true,
} satisfies Prisma.EnvironmentSelect;

function buildWhere(filters: EnvironmentFilters): Prisma.EnvironmentWhereInput {
  return {
    deletedAt: null,
    ...(filters.type && { type: filters.type }),
    ...(filters.clientId && { clientId: filters.clientId }),
    ...(filters.projectId && { projectId: filters.projectId }),
    ...(filters.search && {
      name: { contains: filters.search, mode: "insensitive" },
    }),
  };
}

export const environmentRepository = {
  async findById(id: string, db: Db = prisma) {
    return db.environment.findFirst({ where: { id, deletedAt: null } });
  },

  async findMany(
    filters: EnvironmentFilters,
    pagination: { skip: number; take: number },
    db: Db = prisma
  ): Promise<{ data: EnvironmentSummary[]; total: number }> {
    const where = buildWhere(filters);
    const [data, total] = await Promise.all([
      db.environment.findMany({
        where,
        select: SUMMARY_SELECT,
        orderBy: [{ type: "asc" }, { name: "asc" }],
        skip: pagination.skip,
        take: pagination.take,
      }),
      db.environment.count({ where }),
    ]);
    return { data, total };
  },

  async create(data: Prisma.EnvironmentCreateInput, db: Db = prisma) {
    return db.environment.create({ data });
  },

  async update(
    id: string,
    data: Prisma.EnvironmentUpdateInput,
    db: Db = prisma
  ) {
    return db.environment.update({ where: { id, deletedAt: null }, data });
  },

  async softDelete(id: string, db: Db = prisma) {
    return db.environment.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  },
};
