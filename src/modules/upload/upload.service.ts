import { MultipartFile } from "@fastify/multipart";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { UPLOAD_DIR } from "../../plugins/static";

import { AppError } from "../../shared/errors/AppError";

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

class UploadService {
  async saveImage(file: MultipartFile) {
    const extension = EXTENSION_BY_MIME[file.mimetype];

    if (!extension) {
      throw new AppError(
        400,
        "Only JPEG, PNG, WEBP, and GIF images are allowed."
      );
    }

    let buffer: Buffer;

    try {
      buffer = await file.toBuffer();
    } catch (error) {
      if (
        error instanceof Error &&
        "code" in error &&
        error.code === "FST_REQ_FILE_TOO_LARGE"
      ) {
        throw new AppError(400, "Image must be 5MB or smaller.");
      }

      throw error;
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const filename = `${randomUUID()}${extension}`;

    await writeFile(path.join(UPLOAD_DIR, filename), buffer);

    return filename;
  }
}

export const uploadService = new UploadService();
