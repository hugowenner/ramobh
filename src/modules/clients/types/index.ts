import type { Client, ClientStatus } from "@/generated/prisma";

// Tipo base retornado pelo repository (sem relações)
export type ClientRecord = Client;

// Projeção de listagem — campos suficientes para tabelas/cards
export type ClientSummary = Pick<
  Client,
  "id" | "name" | "cnpj" | "segment" | "status" | "country" | "state" | "city" | "createdAt"
>;

// Filtros aceitos pelo repository
export type ClientFilters = {
  search?: string;
  status?: ClientStatus;
  segment?: string;
};

export type { ClientStatus };
