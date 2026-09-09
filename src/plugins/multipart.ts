import fastifyMultipart from "@fastify/multipart";
import { FastifyInstance } from "fastify";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export default async function multipartPlugin(
  app: FastifyInstance
) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: MAX_FILE_SIZE_BYTES,
      files: 1,
    },
  });
}
