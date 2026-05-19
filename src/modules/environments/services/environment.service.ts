import { NotFoundError, ValidationError } from "@/core/errors";
import { environmentRepository } from "../repositories/environment.repository";
import { clientRepository } from "@/modules/clients/repositories/client.repository";
import { projectRepository } from "@/modules/projects/repositories/project.repository";
import type {
  CreateEnvironmentInput,
  UpdateEnvironmentInput,
  ListEnvironmentsInput,
} from "../schemas";
import type { PaginatedResult } from "@/types";
import type {
  EnvironmentSummary,
  EnvironmentWithRelations,
} from "../types";

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

  async getById(id: string): Promise<EnvironmentWithRelations> {
    const env = await environmentRepository.findById(id);
    if (!env) throw new NotFoundError("Ambiente");
    return env;
  },

  async create(
    input: CreateEnvironmentInput
  ): Promise<EnvironmentWithRelations> {
    const client = await clientRepository.findById(input.clientId);
    if (!client) throw new NotFoundError("Cliente");

    // Validação cruzada: projeto deve pertencer ao mesmo cliente
    if (input.projectId) {
      const project = await projectRepository.findById(input.projectId);
      if (!project) throw new NotFoundError("Projeto");
      if (project.clientId !== input.clientId) {
        throw new ValidationError(
          "O projeto selecionado não pertence ao cliente informado"
        );
      }
    }

    const env = await environmentRepository.create({
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

    return environmentService.getById(env.id);
  },

  async update(
    id: string,
    input: UpdateEnvironmentInput
  ): Promise<EnvironmentWithRelations> {
    const existing = await environmentRepository.findById(id);
    if (!existing) throw new NotFoundError("Ambiente");

    // Validação cruzada: novo projeto deve pertencer ao mesmo cliente do ambiente
    if (input.projectId) {
      const project = await projectRepository.findById(input.projectId);
      if (!project) throw new NotFoundError("Projeto");
      if (project.clientId !== existing.clientId) {
        throw new ValidationError(
          "O projeto selecionado não pertence ao cliente do ambiente"
        );
      }
    }

    await environmentRepository.update(id, {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.type !== undefined && { type: input.type }),
      ...(input.description !== undefined && {
        description: input.description ?? null,
      }),
      ...(input.url !== undefined && { url: input.url || null }),
      ...(input.version !== undefined && {
        version: input.version ?? null,
      }),
      ...(input.notes !== undefined && { notes: input.notes ?? null }),
      ...(input.projectId !== undefined && {
        project: input.projectId
          ? { connect: { id: input.projectId } }
          : { disconnect: true },
      }),
    });

    return environmentService.getById(id);
  },

  async delete(id: string): Promise<void> {
    const existing = await environmentRepository.findById(id);
    if (!existing) throw new NotFoundError("Ambiente");
    await environmentRepository.softDelete(id);
  },
};
