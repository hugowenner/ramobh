import { prisma } from "@/core/database/client";
import type { TransactionClient } from "@/core/database/types";
import type { Prisma } from "@/generated/prisma";
import type { ProjectFilters, ProjectSummary, ProjectWithClient } from "../types";

type Db = TransactionClient | typeof prisma;

const CLIENT_SELECT = { select: { id: true, name: true } } as const;

const SUMMARY_SELECT = {
  id: true,
  name: true,
  description: true,
  type: true,
  status: true,
  startDate: true,
  endDate: true,
  clientId: true,
  createdAt: true,
  client: CLIENT_SELECT,
} satisfies Prisma.ProjectSelect;

function buildWhere(filters: ProjectFilters): Prisma.ProjectWhereInput {
  return {
    deletedAt: null,
    ...(filters.status && { status: filters.status }),
    ...(filters.type && { type: filters.type }),
    ...(filters.clientId && { clientId: filters.clientId }),
    ...(filters.search && {
      OR: [
        { name: { contains: filters.search, mode: "insensitive" } },
        { client: { name: { contains: filters.search, mode: "insensitive" } } },
      ],
    }),
  };
}

export const projectRepository = {
  async findById(id: string, db: Db = prisma): Promise<ProjectWithClient | null> {
    return db.project.findFirst({
      where: { id, deletedAt: null },
      include: { client: CLIENT_SELECT },
    }) as Promise<ProjectWithClient | null>;
  },

  async findMany(
    filters: ProjectFilters,
    pagination: { skip: number; take: number },
    db: Db = prisma
  ): Promise<{ data: ProjectSummary[]; total: number }> {
    const where = buildWhere(filters);
    const [data, total] = await Promise.all([
      db.project.findMany({
        where,
        select: SUMMARY_SELECT,
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take,
      }),
      db.project.count({ where }),
    ]);
    return { data: data as ProjectSummary[], total };
  },

  async create(data: Prisma.ProjectCreateInput, db: Db = prisma) {
    return db.project.create({ data });
  },

  async update(id: string, data: Prisma.ProjectUpdateInput, db: Db = prisma) {
    return db.project.update({ where: { id, deletedAt: null }, data });
  },

  async softDelete(id: string, db: Db = prisma) {
    return db.project.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  },

  async countByClient(clientId: string, db: Db = prisma) {
    return db.project.count({ where: { clientId, deletedAt: null } });
  },
};
