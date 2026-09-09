import { FastifyReply, FastifyRequest } from "fastify";

import { AppError } from "../../shared/errors/AppError";
import { successResponse } from "../../shared/helpers/response";

import { uploadService } from "./upload.service";

class UploadController {
  async uploadImage(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const file = await request.file();

    if (!file) {
      throw new AppError(400, "No file was uploaded.");
    }

    const filename = await uploadService.saveImage(file);

    const url = `${request.protocol}://${request.headers.host}/uploads/${filename}`;

    return successResponse({
      reply,
      statusCode: 201,
      message: "Image uploaded successfully.",
      data: { url },
    });
  }
}

export const uploadController = new UploadController();
