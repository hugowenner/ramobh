export type DocumentFormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  /** Populated on successful create — used for redirect */
  documentId?: string;
} | null;
