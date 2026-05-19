import { z } from "zod";

export const uploadFileSchema = z.object({
  documentId: z.string().cuid("Documento inválido"),
  uploadedBy: z.string().cuid().optional(),
});

export const ALLOWED_MIMETYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
] as const;

export type AllowedMimetype = (typeof ALLOWED_MIMETYPES)[number];

export type UploadFileInput = z.infer<typeof uploadFileSchema>;
