import { NotFoundError } from "@/core/errors";
import { environmentRepository } from "../repositories/environment.repository";
import type {
  CreateEnvironmentInput,
  UpdateEnvironmentInput,
  ListEnvironmentsInput,
} from "../schemas";
import type { PaginatedResult } from "@/types";
import type { EnvironmentRecord, EnvironmentSummary } from "../types";

export const environmentService = {
  async list(
    input: ListEnvironmentsInput
  ): Promise<PaginatedResult<EnvironmentSummary>> {
    const { page, limit, search, type, clientId, projectId } = input;
    const skip = (page - 1) * limit;
    const { data, total } = await environmentRepository.findMany(
      { search, type, clientId, projectId },
      { skip, take: limit }
    );
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getById(id: string): Promise<EnvironmentRecord> {
    const env = await environmentRepository.findById(id);
    if (!env) throw new NotFoundError("Ambiente");
    return env;
  },

  async create(input: CreateEnvironmentInput): Promise<EnvironmentRecord> {
    return environmentRepository.create({
      name: input.name,
      type: input.type,
      description: input.description ?? null,
      url: input.url || null,
      version: input.version ?? null,
      notes: input.notes ?? null,
      client: { connect: { id: input.clientId } },
      ...(input.projectId && {
        project: { connect: { id: input.projectId } },
      }),
    });
  },

  async update(
    id: string,
    input: UpdateEnvironmentInput
  ): Promise<EnvironmentRecord> {
    const existing = await environmentRepository.findById(id);
    if (!existing) throw new NotFoundError("Ambiente");
    return environmentRepository.update(id, input);
  },

  async delete(id: string): Promise<void> {
    const existing = await environmentRepository.findById(id);
    if (!existing) throw new NotFoundError("Ambiente");
    await environmentRepository.softDelete(id);
  },
};
