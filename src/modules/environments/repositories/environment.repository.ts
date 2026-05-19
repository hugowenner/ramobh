import { prisma } from "@/core/database/client";
import type { TransactionClient } from "@/core/database/types";
import type { Prisma } from "@/generated/prisma";
import type {
  EnvironmentFilters,
  EnvironmentSummary,
  EnvironmentWithRelations,
} from "../types";

type Db = TransactionClient | typeof prisma;

const RELATION_SELECT = {
  client: { select: { id: true, name: true } },
  project: { select: { id: true, name: true } },
} as const;

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
  ...RELATION_SELECT,
} satisfies Prisma.EnvironmentSelect;

function buildWhere(
  filters: EnvironmentFilters
): Prisma.EnvironmentWhereInput {
  return {
    deletedAt: null,
    ...(filters.type && { type: filters.type }),
    ...(filters.clientId && { clientId: filters.clientId }),
    ...(filters.projectId && { projectId: filters.projectId }),
    ...(filters.search && {
      OR: [
        { name: { contains: filters.search, mode: "insensitive" } },
        { client: { name: { contains: filters.search, mode: "insensitive" } } },
        { project: { name: { contains: filters.search, mode: "insensitive" } } },
      ],
    }),
  };
}

export const environmentRepository = {
  async findById(
    id: string,
    db: Db = prisma
  ): Promise<EnvironmentWithRelations | null> {
    return db.environment.findFirst({
      where: { id, deletedAt: null },
      include: RELATION_SELECT,
    }) as Promise<EnvironmentWithRelations | null>;
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
    return { data: data as EnvironmentSummary[], total };
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
