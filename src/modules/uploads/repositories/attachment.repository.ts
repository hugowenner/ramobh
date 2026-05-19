import { prisma } from "@/core/database/client";
import type { TransactionClient } from "@/core/database/types";
import type { Prisma } from "@/generated/prisma";

type Db = TransactionClient | typeof prisma;

export const attachmentRepository = {
  async findById(id: string, db: Db = prisma) {
    return db.attachment.findUnique({ where: { id } });
  },

  async findByDocument(documentId: string, db: Db = prisma) {
    return db.attachment.findMany({
      where: { documentId },
      orderBy: { createdAt: "asc" },
    });
  },

  async create(data: Prisma.AttachmentCreateInput, db: Db = prisma) {
    return db.attachment.create({ data });
  },

  async delete(id: string, db: Db = prisma) {
    return db.attachment.delete({ where: { id } });
  },

  async totalSizeByDocument(documentId: string, db: Db = prisma): Promise<number> {
    const result = await db.attachment.aggregate({
      where: { documentId },
      _sum: { size: true },
    });
    return result._sum.size ?? 0;
  },
};
