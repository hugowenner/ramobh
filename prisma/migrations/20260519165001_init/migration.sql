/*
  Warnings:

  - You are about to drop the column `content` on the `documents` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schemaSnapshot` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `templateVersion` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Made the column `templateId` on table `documents` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_templateId_fkey";

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "content",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "data" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "schemaSnapshot" JSONB NOT NULL,
ADD COLUMN     "templateVersion" TEXT NOT NULL,
ALTER COLUMN "templateId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "documents_createdById_deletedAt_idx" ON "documents"("createdById", "deletedAt");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
