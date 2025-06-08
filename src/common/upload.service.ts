import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';

@Injectable()
export class UploadService {
  private uploadPath = 'uploads';

  /**
   * Simpan file ke folder uploads dan return nama filenya
   */
  async saveFile(buffer: Buffer, originalName: string): Promise<string> {
    if (!existsSync(this.uploadPath)) {
      await mkdir(this.uploadPath, { recursive: true });
    }

    const timestamp = Date.now();
    const filename = `${timestamp}-${originalName}`;
    const filePath = join(this.uploadPath, filename);
    await writeFile(filePath, buffer);
    return filename;
  }

  /**
   * Hapus file berdasarkan nama file (bukan path lengkap)
   */
  async deleteFile(filename: string): Promise<void> {
    const filePath = join(this.uploadPath, filename);

    try {
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    } catch (err) {
      console.warn(`Gagal menghapus file: ${filename}`, err);
      // Opsional: bisa lempar error jika ingin gagal total
    }
  }
}
