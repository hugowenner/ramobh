@AGENTS.md

# Portal Técnico Ramo — Contexto para Claude Code

## Stack
- **Framework:** Next.js 16, App Router, TypeScript strict
- **Estilo:** Tailwind 4 (CSS-based config), shadcn/ui (new-york)
- **ORM:** Prisma 7 — client gerado em `src/generated/prisma`
- **Auth:** Auth.js v5 (next-auth beta) com Credentials + PrismaAdapter
- **DB:** PostgreSQL via Docker
- **Validação:** Zod
- **Utilitários:** clsx + tailwind-merge via `cn()` em `src/lib/utils.ts`

## Arquitetura
Monólito modular. Cada módulo em `src/modules/{nome}/` contém:
`actions/` `services/` `repositories/` `schemas/` `components/` `types/`

## Regras de desenvolvimento
1. **Nunca gere o sistema inteiro** — uma etapa por vez
2. **TypeScript strict** — sem `any`
3. **Zod** para toda validação de input
4. **Sem over-engineering** — apenas o necessário para a etapa atual
5. **Server Actions** para mutações, **Route Handlers** para APIs que precisam de HTTP explícito

## Prisma 7 — atenção
- `datasource db` NO schema.prisma NÃO tem `url =`
- A URL fica em `prisma.config.ts` → `datasource.url`
- Importar client: `import { PrismaClient } from "@/generated/prisma"`

## Auth.js v5 — atenção
- Arquivo de config: `src/lib/auth.ts`
- Handler: `src/app/api/auth/[...nextauth]/route.ts`
- Middleware: `src/middleware.ts`
- Session strategy: JWT

## Scripts úteis
```bash
npm run db:up          # sobe PostgreSQL via Docker
npm run db:migrate     # cria migration dev
npm run db:studio      # abre Prisma Studio
npm run setup          # db:up + generate + migrate
```

## Path aliases
`@/*` → `src/*`
