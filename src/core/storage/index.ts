export { LocalStorageAdapter } from "./local.adapter";
export type { IStorageAdapter, StoredFile } from "./types";

// Instância ativa — trocar por S3Adapter ou AzureAdapter quando necessário
import { LocalStorageAdapter } from "./local.adapter";
export const storage = new LocalStorageAdapter();
