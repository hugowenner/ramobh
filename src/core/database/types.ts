import type { PrismaClient } from "@/generated/prisma";

/**
 * Tipo do client dentro de um bloco prisma.$transaction(async (tx) => ...).
 * Repositories aceitam este tipo como parâmetro opcional para suportar
 * operações transacionais orquestradas por services.
 */
export type TransactionClient = Parameters<
  Parameters<PrismaClient["$transaction"]>[0]
>[0];
