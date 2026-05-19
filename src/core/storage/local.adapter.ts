import fs from "fs/promises";
import path from "path";
import type { IStorageAdapter, StoredFile } from "./types";

const UPLOAD_BASE = process.env.UPLOAD_DIR ?? "./uploads";

export class LocalStorageAdapter implements IStorageAdapter {
  async save(
    buffer: Buffer,
    filename: string,
    subfolder = ""
  ): Promise<StoredFile> {
    const dir = path.join(UPLOAD_BASE, subfolder);
    await fs.mkdir(dir, { recursive: true });

    const unique = `${Date.now()}-${filename}`;
    const fullPath = path.join(dir, unique);
    await fs.writeFile(fullPath, buffer);

    const storagePath = path.join(subfolder, unique).replace(/\\/g, "/");
    return {
      storagePath,
      storageType: "LOCAL",
      publicUrl: `/api/uploads/${storagePath}`,
    };
  }

  async delete(storagePath: string): Promise<void> {
    const fullPath = path.join(UPLOAD_BASE, storagePath);
    await fs.unlink(fullPath).catch(() => {
      // silencia se o arquivo já foi removido
    });
  }

  getUrl(storagePath: string): string {
    return `/api/uploads/${storagePath}`;
  }
}
