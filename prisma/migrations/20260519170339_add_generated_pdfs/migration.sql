-- CreateTable
CREATE TABLE "generated_pdfs" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL DEFAULT 'application/pdf',
    "templateVersion" TEXT NOT NULL,
    "documentVersion" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "generatedById" TEXT,

    CONSTRAINT "generated_pdfs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "generated_pdfs_documentId_generatedAt_idx" ON "generated_pdfs"("documentId", "generatedAt");

-- AddForeignKey
ALTER TABLE "generated_pdfs" ADD CONSTRAINT "generated_pdfs_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
