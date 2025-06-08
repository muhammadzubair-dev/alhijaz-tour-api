// src/upload/upload.service.ts
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

@Injectable()
export class UploadService {
  private uploadPath = 'uploads';

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
}
