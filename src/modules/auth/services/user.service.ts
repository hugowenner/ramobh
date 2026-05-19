import bcrypt from "bcryptjs";
import { NotFoundError, ConflictError } from "@/core/errors";
import { userRepository } from "../repositories/user.repository";
import type { UserRole } from "@/generated/prisma";

const BCRYPT_ROUNDS = 12;

export const userService = {
  async getById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError("Usuário");
    return user;
  },

  async getByEmail(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new NotFoundError("Usuário");
    return user;
  },

  async create(data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw new ConflictError("E-mail");

    const hashed = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

    return userRepository.create({
      name: data.name,
      email: data.email,
      password: hashed,
      role: data.role ?? "VIEWER",
    });
  },

  async changePassword(id: string, currentPassword: string, newPassword: string) {
    const user = await userRepository.findByEmailWithPassword(
      (await userRepository.findById(id))?.email ?? ""
    );
    if (!user?.password) throw new NotFoundError("Usuário");

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) throw new Error("Senha atual incorreta");

    const hashed = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    return userRepository.updatePassword(id, hashed);
  },

  async listAll() {
    return userRepository.findMany();
  },
};
