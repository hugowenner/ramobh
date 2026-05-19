-- Migration: add_template_slug
--
-- Adds a stable, unique slug to each template.
-- The slug is the seed's upsert key — it never changes even if the name is renamed.
--
-- Applied to a fresh empty table on `migrate reset` (no existing rows → no default needed).
-- For safety in `migrate deploy` on a DB with data, we add as nullable, backfill, then constrain.

-- Step 1: add nullable
ALTER TABLE "templates" ADD COLUMN "slug" TEXT;

-- Step 2: backfill any existing rows (slug = lowercased name, symbols → hyphens)
--   Uses translate() for common pt-BR diacritics + regexp_replace for symbols.
UPDATE "templates"
SET "slug" = lower(
  regexp_replace(
    regexp_replace(
      translate(
        "name",
        'áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÔÖÚÙÛÜÇ',
        'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC'
      ),
      '[^a-zA-Z0-9]+', '-', 'g'
    ),
    '^-+|-+$', '', 'g'
  )
)
WHERE "slug" IS NULL;

-- Step 3: enforce NOT NULL
ALTER TABLE "templates" ALTER COLUMN "slug" SET NOT NULL;

-- Step 4: unique index
CREATE UNIQUE INDEX "templates_slug_key" ON "templates"("slug");
