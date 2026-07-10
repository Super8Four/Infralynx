import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve } from 'node:path';

export interface StorageBackend {
  delete(key: string): Promise<void>;
  get(key: string): Promise<Buffer>;
  put(key: string, value: Buffer): Promise<void>;
}

export class LocalStorageBackend implements StorageBackend {
  readonly #root: string;

  constructor(root: string) {
    this.#root = resolve(root);
  }

  #pathFor(key: string): string {
    const path = resolve(this.#root, key);
    const relativePath = relative(this.#root, path);
    if (relativePath.startsWith('..') || isAbsolute(relativePath)) {
      throw new Error('Storage key escapes the configured root.');
    }
    return path;
  }

  async put(key: string, value: Buffer): Promise<void> {
    const path = this.#pathFor(key);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, value);
  }

  async get(key: string): Promise<Buffer> {
    return readFile(this.#pathFor(key));
  }

  async delete(key: string): Promise<void> {
    await rm(this.#pathFor(key), { force: true });
  }
}
