import { prisma } from "@/core/database/client";
import type { TransactionClient } from "@/core/database/types";
import type { Prisma, UserRole } from "@/generated/prisma";

type Db = TransactionClient | typeof prisma;

export const userRepository = {
  async findById(id: string, db: Db = prisma) {
    return db.user.findUnique({ where: { id } });
  },

  async findByEmail(email: string, db: Db = prisma) {
    return db.user.findUnique({ where: { email } });
  },

  async findByEmailWithPassword(email: string, db: Db = prisma) {
    return db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        emailVerified: true,
      },
    });
  },

  async create(data: Prisma.UserCreateInput, db: Db = prisma) {
    return db.user.create({ data });
  },

  async updateRole(id: string, role: UserRole, db: Db = prisma) {
    return db.user.update({ where: { id }, data: { role } });
  },

  async updatePassword(id: string, hashedPassword: string, db: Db = prisma) {
    return db.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  },

  async findMany(db: Db = prisma) {
    return db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        emailVerified: true,
      },
      orderBy: { name: "asc" },
    });
  },
};
