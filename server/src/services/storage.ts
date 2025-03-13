import fs from 'fs/promises';
import path from 'path';

interface StorageEntry<T> {
  value: T;
  expiresAt?: number;
}

export class Storage {
  private filePath: string;
  private data: Record<string, StorageEntry<any>> = {};

  constructor(fileName = 'storage.json') {
    this.filePath = path.join(__dirname, `../../${fileName}`);
  }

  async init(): Promise<void> {
    try {
      const fileContent = await fs.readFile(this.filePath, 'utf-8');
      this.data = JSON.parse(fileContent);
      this.cleanup();
    } catch {
      this.data = {};
    }
  }

  async set<T>(key: string, value: T, ttlMs?: number): Promise<void> {
    const expiresAt = ttlMs ? Date.now() + ttlMs : undefined;
    this.data[key] = { value, expiresAt };
    await this.save();
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.data[key];
    if (!entry) return null;

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      await this.remove(key);
      return null;
    }

    return entry.value;
  }

  async remove(key: string): Promise<void> {
    delete this.data[key];
    await this.save();
  }

  async clear(): Promise<void> {
    this.data = {};
    await this.save();
  }

  private async cleanup(): Promise<void> {
    const now = Date.now();
    let updated = false;

    Object.keys(this.data).forEach((key) => {
      if (this.data[key].expiresAt && this.data[key].expiresAt! < now) {
        delete this.data[key];
        updated = true;
      }
    });

    if (updated) await this.save();
  }

  private async save(): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(this.data, null, 2));
  }
}
