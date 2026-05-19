import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { isLegacyTemplateSchema, validateTemplateSchema } from "../src/modules/templates/utils/schema";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const templates = await prisma.template.findMany({
    select: { name: true, slug: true, schema: true },
  });

  console.log(`\n── Templates no banco: ${templates.length} ──`);
  let legacyCount = 0;
  let invalidCount = 0;

  for (const t of templates) {
    const isLegacy = isLegacyTemplateSchema(t.schema);
    if (isLegacy) legacyCount++;

    let valid = false;
    try {
      validateTemplateSchema(t.schema, t.name);
      valid = true;
    } catch {
      invalidCount++;
    }

    const obj = t.schema as Record<string, unknown>;
    const sectionCount = Array.isArray(obj.sections) ? obj.sections.length : 0;

    const status = valid ? "✓" : "✗";
    console.log(
      `  ${status} [${t.slug}] "${t.name}" | sections: ${sectionCount} | legacy: ${isLegacy} | valid: ${valid}`
    );
  }

  console.log(`\n── Documentos no banco ──`);
  const docs = await prisma.document.findMany({
    select: { id: true, title: true, schemaSnapshot: true },
  });
  console.log(`  Total: ${docs.length}`);
  let snapshotLegacy = 0;
  for (const d of docs) {
    if (isLegacyTemplateSchema(d.schemaSnapshot)) {
      snapshotLegacy++;
      console.log(`  ✗ Snapshot legado: "${d.title}" (${d.id})`);
    }
  }
  if (snapshotLegacy === 0) console.log("  ✓ Nenhum snapshot legado");

  console.log(`\n── Resultado ──`);
  console.log(`  Schemas legados:  ${legacyCount}`);
  console.log(`  Schemas inválidos: ${invalidCount}`);
  console.log(`  Snapshots legados: ${snapshotLegacy}`);

  if (legacyCount === 0 && invalidCount === 0 && snapshotLegacy === 0) {
    console.log("\n  ✓ BANCO LIMPO — nenhum dado legado encontrado\n");
  } else {
    console.log("\n  ✗ ATENÇÃO — dados legados ainda presentes\n");
    process.exit(1);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
