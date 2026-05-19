export type StoredFile = {
  storagePath: string;
  storageType: "LOCAL" | "S3" | "AZURE_BLOB";
  publicUrl: string;
};

export interface IStorageAdapter {
  save(buffer: Buffer, filename: string, subfolder?: string): Promise<StoredFile>;
  delete(storagePath: string): Promise<void>;
  getUrl(storagePath: string): string;
}
