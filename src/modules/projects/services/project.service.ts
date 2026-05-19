import { NotFoundError } from "@/core/errors";
import { withTransaction } from "@/core/database/client";
import { projectRepository } from "../repositories/project.repository";
import { clientRepository } from "@/modules/clients/repositories/client.repository";
import { environmentRepository } from "@/modules/environments/repositories/environment.repository";
import type { CreateProjectInput, UpdateProjectInput, ListProjectsInput } from "../schemas";
import type { PaginatedResult } from "@/types";
import type { ProjectSummary, ProjectWithClient } from "../types";
import type { CreateEnvironmentInput } from "@/modules/environments/schemas";

export const projectService = {
  async list(input: ListProjectsInput): Promise<PaginatedResult<ProjectSummary>> {
    const { page, limit, search, status, type, clientId } = input;
    const skip = (page - 1) * limit;
    const { data, total } = await projectRepository.findMany(
      { search, status, type, clientId },
      { skip, take: limit }
    );
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getById(id: string): Promise<ProjectWithClient> {
    const project = await projectRepository.findById(id);
    if (!project) throw new NotFoundError("Projeto");
    return project;
  },

  async create(input: CreateProjectInput): Promise<ProjectWithClient> {
    const client = await clientRepository.findById(input.clientId);
    if (!client) throw new NotFoundError("Cliente");

    const project = await projectRepository.create({
      name: input.name,
      description: input.description ?? null,
      type: input.type,
      status: input.status,
      startDate: input.startDate ?? null,
      endDate: input.endDate ?? null,
      client: { connect: { id: input.clientId } },
    });

    // re-fetch com client para manter contrato de tipo consistente
    return projectService.getById(project.id);
  },

  async createWithEnvironment(
    projectInput: CreateProjectInput,
    environmentInput: Omit<CreateEnvironmentInput, "clientId" | "projectId">
  ): Promise<{ project: ProjectWithClient }> {
    const client = await clientRepository.findById(projectInput.clientId);
    if (!client) throw new NotFoundError("Cliente");

    return withTransaction(async (tx) => {
      const project = await projectRepository.create(
        {
          name: projectInput.name,
          description: projectInput.description ?? null,
          type: projectInput.type,
          status: projectInput.status,
          startDate: projectInput.startDate ?? null,
          endDate: projectInput.endDate ?? null,
          client: { connect: { id: projectInput.clientId } },
        },
        tx
      );

      await environmentRepository.create(
        {
          name: environmentInput.name,
          type: environmentInput.type,
          description: environmentInput.description ?? null,
          url: environmentInput.url ?? null,
          version: environmentInput.version ?? null,
          notes: environmentInput.notes ?? null,
          client: { connect: { id: projectInput.clientId } },
          project: { connect: { id: project.id } },
        },
        tx
      );

      return { project: await projectRepository.findById(project.id) as ProjectWithClient };
    });
  },

  async update(id: string, input: UpdateProjectInput): Promise<ProjectWithClient> {
    const existing = await projectRepository.findById(id);
    if (!existing) throw new NotFoundError("Projeto");

    await projectRepository.update(id, {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.description !== undefined && { description: input.description ?? null }),
      ...(input.type !== undefined && { type: input.type }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.startDate !== undefined && { startDate: input.startDate ?? null }),
      ...(input.endDate !== undefined && { endDate: input.endDate ?? null }),
    });

    return projectService.getById(id);
  },

  async delete(id: string): Promise<void> {
    const existing = await projectRepository.findById(id);
    if (!existing) throw new NotFoundError("Projeto");
    await projectRepository.softDelete(id);
  },
};
