import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { auth } from "@/lib/auth";
import { prisma } from "@/core/database/client";

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/documents/[id]/pdf
 *
 * Streams the most recently generated PDF for a document.
 * Requires an authenticated session.
 *
 * Future: add ?pdfId=xxx to download a specific historical version.
 */
export async function GET(
  _request: NextRequest,
  { params }: Params
): Promise<NextResponse> {
  // ── Auth ────────────────────────────────────────────────────
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id: documentId } = await params;

  // ── Lookup latest generated PDF ──────────────────────────────
  const pdf = await prisma.generatedPdf.findFirst({
    where: { documentId },
    orderBy: { generatedAt: "desc" },
    select: {
      storagePath: true,
      filename: true,
      size: true,
      mimeType: true,
    },
  });

  if (!pdf) {
    return NextResponse.json(
      { error: "Nenhum PDF gerado para este documento" },
      { status: 404 }
    );
  }

  // ── Read file ────────────────────────────────────────────────
  const uploadDir = process.env.UPLOAD_DIR ?? "./uploads";
  const fullPath = path.join(process.cwd(), uploadDir, pdf.storagePath);

  let buffer: Buffer;
  try {
    buffer = await fs.readFile(fullPath);
  } catch {
    return NextResponse.json(
      { error: "Arquivo PDF não encontrado no storage" },
      { status: 404 }
    );
  }

  // ── Stream response ──────────────────────────────────────────
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": pdf.mimeType,
      "Content-Disposition": `attachment; filename="${pdf.filename}"`,
      "Content-Length": String(buffer.length),
      // Prevent caching — PDFs are point-in-time snapshots
      "Cache-Control": "no-store",
    },
  });
}
