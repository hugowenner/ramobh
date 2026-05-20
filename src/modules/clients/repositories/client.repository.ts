import { prisma } from "@/core/database/client";
import type { TransactionClient } from "@/core/database/types";
import type { Prisma } from "@/generated/prisma";
import type { ClientFilters, ClientSummary } from "../types";

type Db = TransactionClient | typeof prisma;

const SUMMARY_SELECT = {
  id: true,
  name: true,
  cnpj: true,
  segment: true,
  status: true,
  country: true,
  state: true,
  city: true,
  createdAt: true,
} satisfies Prisma.ClientSelect;

function buildWhere(filters: ClientFilters): Prisma.ClientWhereInput {
  return {
    deletedAt: null,
    ...(filters.status && { status: filters.status }),
    ...(filters.segment && { segment: filters.segment }),
    ...(filters.search && {
      OR: [
        { name: { contains: filters.search, mode: "insensitive" } },
        { cnpj: { contains: filters.search.replace(/\D/g, "") } },
      ],
    }),
  };
}

export const clientRepository = {
  async findById(id: string, db: Db = prisma) {
    return db.client.findFirst({ where: { id, deletedAt: null } });
  },

  async findMany(
    filters: ClientFilters,
    pagination: { skip: number; take: number },
    db: Db = prisma
  ): Promise<{ data: ClientSummary[]; total: number }> {
    const where = buildWhere(filters);
    const [data, total] = await Promise.all([
      db.client.findMany({
        where,
        select: SUMMARY_SELECT,
        orderBy: { name: "asc" },
        skip: pagination.skip,
        take: pagination.take,
      }),
      db.client.count({ where }),
    ]);
    return { data, total };
  },

  async create(data: Prisma.ClientCreateInput, db: Db = prisma) {
    return db.client.create({ data });
  },

  async update(
    id: string,
    data: Prisma.ClientUpdateInput,
    db: Db = prisma
  ) {
    return db.client.update({ where: { id, deletedAt: null }, data });
  },

  async softDelete(id: string, db: Db = prisma) {
    return db.client.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  },

  async existsByCnpj(cnpj: string, excludeId?: string, db: Db = prisma) {
    const client = await db.client.findFirst({
      where: { cnpj, deletedAt: null, ...(excludeId && { id: { not: excludeId } }) },
      select: { id: true },
    });
    return client !== null;
  },

  /**
   * Retorna todos os clientes ativos como opções para selects.
   * Query mínima: apenas id + name, sem paginação.
   * Usada em filtros de documentos e outros módulos.
   */
  async findAllForSelect(
    db: Db = prisma
  ): Promise<{ id: string; name: string }[]> {
    return db.client.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  },
};
