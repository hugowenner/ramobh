import { NotFoundError, ConflictError } from "@/core/errors";
import { clientRepository } from "../repositories/client.repository";
import type { CreateClientInput, UpdateClientInput, ListClientsInput } from "../schemas";
import type { PaginatedResult } from "@/types";
import type { ClientRecord, ClientSummary } from "../types";

export const clientService = {
  async list(input: ListClientsInput): Promise<PaginatedResult<ClientSummary>> {
    const { page, limit, search, status, segment } = input;
    const skip = (page - 1) * limit;

    const { data, total } = await clientRepository.findMany(
      { search, status, segment },
      { skip, take: limit }
    );

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getById(id: string): Promise<ClientRecord> {
    const client = await clientRepository.findById(id);
    if (!client) throw new NotFoundError("Cliente");
    return client;
  },

  async create(input: CreateClientInput): Promise<ClientRecord> {
    if (input.cnpj) {
      const exists = await clientRepository.existsByCnpj(input.cnpj);
      if (exists) throw new ConflictError("CNPJ");
    }

    return clientRepository.create({
      name: input.name,
      cnpj: input.cnpj || null,
      segment: input.segment || null,
      status: input.status,
      country: input.country,
      state: input.state || null,
      city: input.city || null,
      notes: input.notes || null,
    });
  },

  async update(id: string, input: UpdateClientInput): Promise<ClientRecord> {
    const existing = await clientRepository.findById(id);
    if (!existing) throw new NotFoundError("Cliente");

    if (input.cnpj && input.cnpj !== existing.cnpj) {
      const exists = await clientRepository.existsByCnpj(input.cnpj, id);
      if (exists) throw new ConflictError("CNPJ");
    }

    return clientRepository.update(id, input);
  },

  async delete(id: string): Promise<void> {
    const existing = await clientRepository.findById(id);
    if (!existing) throw new NotFoundError("Cliente");
    await clientRepository.softDelete(id);
  },
};
